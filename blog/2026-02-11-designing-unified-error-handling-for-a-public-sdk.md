---
title: Designing unified error handling for a public SDK
description: A GraphQL API has two different error channels. An SDK that only surfaces one of them is lying by omission — here is how we unified both behind a single error type.
date: 2026-02-02
type: build-log
project: sdk-architecture
topics:
  - sdk
  - typescript
  - error-handling
  - graphql
featured: false
---

An SDK's error behaviour is part of its public API. Every caller has to make a decision about errors — handle them, retry them, or ignore them — and they can only make that decision if the error they receive is honest about what happened.

Ours was not honest. The backend had two ways of reporting failure, and the client only handled one of them.

## Two error channels

GraphQL gives an API two distinct places to put an error.

**Protocol errors** live in the top-level `errors` array:

```json
{
  "errors": [
    {
      "message": "The current user is not authorized to access this resource.",
      "extensions": { "code": "AUTH_NOT_AUTHENTICATED" }
    }
  ],
  "data": { "alert": null }
}
```

These are system-level failures: missing authentication, broken requests, legacy operations. Our HTTP client already converted them into a generic `ClientError`, so this channel worked.

**Payload errors** live inside the response data:

```json
{
  "errors": null,
  "data": {
    "createSlackChannelTarget": {
      "slackChannelTarget": null,
      "errors": [
        {
          "__typename": "TargetLimitExceededError",
          "message": "You have reached the maximum number of targets."
        }
      ]
    }
  }
}
```

This channel carries business-rule failures: quota limits, missing targets, invalid arguments. It is type-safe by design — the `__typename` tells you exactly which error you got.

And it was largely ignored. Mutation methods returned the payload to the caller and left the `errors` array for them to notice. Some did not even use the pattern yet. The result was an API surface where the same failure could be a rejection, a silent no-op, or a null field depending on which mutation you called.

## What good looks like

We wanted three properties:

- **One type to check.** Callers should be able to ask "is this an authentication error?" without string matching a message.
- **No lost context.** The original `__typename`, the message and the underlying cause should all survive the conversion.
- **No big-bang break.** Existing throws had to keep working while new code adopted the new type.

## The design

We added an `errors/` module to the client package rather than replacing the existing error handling. At its centre is a base class and a factory:

```ts
export class SdkError extends Error {
  readonly errorType: string;
  readonly code: string;
  readonly cause?: unknown;

  static from(e: unknown): SdkError {
    if (e instanceof SdkError) return e;
    if (isPayloadError(e)) return fromPayloadError(e);
    if (e instanceof Error) return new SdkUnknownError(e.message, 'UNKNOWN', e);
    return new SdkUnknownError(String(e), 'UNKNOWN', e);
  }
}
```

The factory is the key detail. Instead of asking every call site to know which class to construct, they all funnel through `SdkError.from(...)`. It is idempotent, it accepts anything, and it never throws while trying to describe a throw.

A type guard identifies payload errors by their shape:

```ts
function isPayloadError(
  e: unknown,
): e is { __typename: string; message: string } {
  return (
    typeof e === 'object' &&
    e !== null &&
    '__typename' in e &&
    'message' in e
  );
}
```

Then a switch maps error families onto subclasses:

```text
TargetLimitExceededError, TargetDoesNotExistError, Web3TargetNotFoundError, ...
  → SdkTargetError (TARGET)
UnauthorizedAccessError
  → SdkAuthenticationError (AUTHENTICATION)
ArgumentError, ArgumentOutOfRangeError, ArgumentNullError
  → SdkValidationError (VALIDATION)
everything else
  → SdkUnknownError (UNKNOWN)
```

Each subclass carries an `errorType` category, the original backend `code`, a timestamp and the `cause`. Consumers can now branch on category instead of probing messages.

At the call sites, mutations validate their payload before returning:

```ts
const mutation = await this.service.createWebPushTarget(input);
const errors = mutation.createWebPushTarget.errors;
if (errors && errors.length > 0) {
  throw SdkError.from(errors[0]);
}
return mutation;
```

In the React layer, unsafe casts disappeared:

```ts
// before
.catch((e) => setError(e as Error))

// after
.catch((e) => setError(SdkError.from(e)))
```

## The unglamorous part

The interesting engineering was not the class hierarchy. It was the schema archaeology needed to make the hierarchy complete.

Payload errors only exist if the schema declares them, and it did not declare them consistently. We catalogued every mutation the SDK consumed, recorded which ones implemented the pattern, and then added the missing error fragments to the schema and type generation. Only after the types were honest could the runtime be.

A few operations also turned out to return protocol errors where the schema promised payload errors. The abstraction had to tolerate both — which the `from()` factory does by construction.

## The deliberate breaking change

The migration shipped in a major release, because it changed observable behaviour: mutations that previously swallowed payload errors now throw them. The release notes called it out explicitly, with a migration example:

```ts
try {
  await client.deleteAlerts({ ids: alertIds });
} catch (error) {
  if (error instanceof SdkValidationError) {
    // handle validation error
  }
}
```

That is the honest version. The previous behaviour — accepting an empty ID list and returning as if it did something — was the actual bug.

## Why categories matter

Unified errors are not just nicer to catch. They make automations possible.

We wanted to wire an on-call paging tool into the SDK's CI/CD pipeline, but paging a human on every expected failure is worse than no paging at all. Categorised errors let the pipeline ignore known conditions such as rate limits while still escalating genuine faults. Without the abstraction, that classification would have been string matching on messages — which breaks the first time a message is reworded.

If an SDK reports failures in two ways, callers will handle one of them and ignore the other. Collapsing both into a typed, categorised error is the smallest change that makes the API tell the truth.
