---
title: When reusable architecture becomes an executable workflow
description: How a customer integration template, wallet abstraction, explicit decision rules and evals turned repeated implementation work into an agent-operable workflow.
date: 2026-06-29
type: retrospective
project: sdk-architecture
topics:
  - sdk
  - architecture
  - ai
  - developer-tools
  - evals
featured: false
---

The most useful agent workflows I have built did not start with an agent.

They started with architecture that had already made variation explicit.

In 2024, the Notifi SDK monorepo gained a reusable full-page DApp example and a wallet-provider layer. The goal was practical: stop rebuilding the same customer-facing notification application from scratch when most of the flow was stable and only a smaller set of details changed between integrations.

By 2026, that same structure had become the basis for an agent workflow that can guide a full-page integration from a known baseline.

The interesting part is not that an AI model can edit a Next.js application. The interesting part is why the application became safe enough to edit through a constrained workflow at all.

The answer is that the important product decisions had already been turned into boundaries.

## The template was already halfway to automation

The public [`notifi-dapp-example`](https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages/notifi-dapp-example) started as a reusable application baseline.

Instead of making each customer integration invent its own structure, the template kept the stable parts in one place:

- authentication flow
- SDK and provider wiring
- notification subscription behavior
- routing and application states
- deployment shape

The things that legitimately varied were pushed toward explicit configuration or extension points:

- tenant
- subscription card
- runtime environment
- blockchain
- wallet choice
- branding and copy

The separate [`notifi-wallet-provider`](https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages/notifi-wallet-provider) moved another major source of variation behind an adapter boundary. The host application could ask for wallet capabilities without embedding EVM, Solana, Cosmos and Cardano implementation details throughout the page.

That architecture was designed for reuse by engineers, not for AI.

But it created exactly the conditions an agent workflow needs:

```text
stable baseline
+
explicit variation points
+
known extension boundaries
=
repeatable integration work
```

Once the work is repeatable, the next question is whether the repetition can be expressed as a decision process instead of tribal knowledge.

## "Modify the example app" is not a workflow

A naive agent prompt might say:

```text
Clone the DApp example and customize it for this customer.
```

That sounds reasonable until the missing decisions show up.

Which tenant?
Which subscription card?
Production or another environment?
Which blockchain ecosystem?
Which wallets?
Is the user asking for a standalone app or an integration inside an existing application?
Should the agent edit the SDK monorepo directly or work from a copy?

A human engineer familiar with the product may resolve those questions from context. An agent can also resolve them — but if the workflow does not tell it which questions are mandatory, it may resolve them by guessing.

That is the dangerous version of automation: it makes an ambiguous process faster without making the ambiguity smaller.

The full-page integration path therefore needed more than instructions about code. It needed an **integration contract**.

## Turn tacit knowledge into a decision contract

The public [`notifi-react-integration` skill](https://github.com/notifi-network/notifi-sdk-ts/blob/main/ai/skills/notifi-react-integration/SKILL.md) now treats a full-page application as a distinct path from embedding a component into an existing app.

At a high level, the decision flow looks like this:

```text
Does the user want a full-page app?
        ↓ yes
Use the DApp example baseline
        ↓
Confirm tenantId
        ↓
Confirm cardId
        ↓
Resolve environment
        ↓
Choose chain group
        ↓
Choose supported wallet(s)
        ↓
Resolve auth path
        ↓
Modify a prepared working copy
        ↓
Validate the result
```

The sequence matters.

For example, wallet selection does not happen before the chain group is known. The supported wallet set is derived from the wallet-provider model, so asking for wallets first creates combinations the product may not support.

The workflow currently groups the decision around four chain families:

```text
evm
solana
cosmos
cardano
```

Only after one of those is selected does the workflow ask which supported wallets in that family should be included.

This is a small example of a larger design rule:

> A good agent workflow should preserve the dependency order of the underlying system.

If decision B is only meaningful after decision A, the agent should not be allowed to treat them as independent prompt fields.

## Hard stops are more valuable than clever prompts

The part I find most important is not how the skill describes the happy path. It is where the workflow refuses to continue.

For the full-page path, missing core information is treated as blocking:

```text
no tenantId        → do not generate
no cardId          → do not generate
no chain group     → do not choose wallets
unknown auth path  → do not invent one
unsupported wallet → do not silently substitute another
```

The public skill also separates the working copy from the SDK source tree. The agent is expected to prepare or pull a copy of `packages/notifi-dapp-example` and customize that copy rather than editing the monorepo package in place.

That rule is operational rather than architectural, but it matters just as much. A workflow can understand the right product boundary and still cause damage if it operates on the wrong workspace.

This changed how I think about agent instructions.

A useful skill is not primarily a long prompt containing everything the model should know. It is a set of **allowed transitions and stopping conditions** around a task.

The positive instructions explain how to succeed. The hard stops define what correctness means when required context is missing.

## Reuse product boundaries instead of teaching the agent every implementation

Another important decision was not to make the agent understand every wallet implementation itself.

The product already had a wallet abstraction. The workflow should use it.

Conceptually:

```text
customer request
      ↓
chain group
      ↓
supported wallet selection
      ↓
notifi-wallet-provider
      ↓
normalized wallet/auth surface
      ↓
DApp baseline
```

The agent does not need separate integration strategies for MetaMask, Phantom, Keplr, Lace and every future wallet if the product has already centralized that knowledge behind the provider package.

This is where architecture and automation reinforce each other.

A weak product boundary forces agent instructions to compensate with more special cases. A strong product boundary lets the workflow operate at the same abstraction level as the application.

That keeps the skill smaller, but more importantly it keeps two sources of truth from drifting apart.

The canonical wallet support model remains in the wallet-provider package. The agent workflow reads that model instead of maintaining a second independent matrix inside prose.

## A runnable baseline is better than generated scaffolding

There is another reason the DApp example works well as an automation surface: it is a real application baseline, not a synthetic scaffold invented by the agent.

The difference is important.

A generated scaffold starts from the model's idea of what the integration should look like. A reusable baseline starts from code the product team already maintains.

```text
free-form generation
→ model invents structure
→ product conventions must be reconstructed
→ more room for architectural drift

known baseline
→ model starts from maintained structure
→ variation is applied at explicit boundaries
→ less architecture needs to be regenerated
```

The agent still writes code, but it is operating inside a narrower design space.

That is usually a better trade-off for customer integrations. The goal is not maximum creativity. The goal is a correct instance of a known product shape.

## Validation became part of the workflow

Generation without validation is only faster uncertainty.

The public repository therefore includes a dedicated [full-page eval fixture](https://github.com/notifi-network/notifi-sdk-ts/blob/main/ai/eval-fixtures/notifi-react-integration/notifi-dapp-example-full-page/fixture.json). The fixture extracts the DApp example from a pinned repository commit and prepares the relevant subdirectory as the working application.

That gives the workflow a stable target for evaluation instead of relying on whatever happens to be at `main` during a test run.

The corresponding [evaluation cases](https://github.com/notifi-network/notifi-sdk-ts/blob/main/ai/skills/notifi-react-integration/evals/evals.json) and [rubric](https://github.com/notifi-network/notifi-sdk-ts/blob/main/ai/skills/notifi-react-integration/evals/rubric.md) test more than whether the model can produce plausible code.

They also test decision behavior:

- did it choose the full-page path instead of a component-integration path?
- did it use the DApp example as the baseline?
- did it avoid editing the SDK source package directly?
- did it stop when tenant or card information was missing?
- did it ask for the chain group before asking for wallets?
- did it stay within the wallet-provider support model?

That is a better definition of success than "the answer contains React code."

The workflow has behavior, so the behavior should be testable.

This is the point where the work starts overlapping with my broader [AI Developer Tools](/projects/ai-dev-tools) work: skills make a workflow repeatable, while evals make changes to that workflow observable.

## The agent is the operator, not the architect

The progression from 2024 to 2026 can look like an AI story:

```text
manual customer integration
→ template
→ agent-generated integration
```

I think that framing misses the useful lesson.

The more accurate progression is:

```text
implicit engineering decisions
        ↓
reusable architecture
        ↓
explicit variation points
        ↓
explicit decision workflow
        ↓
testable agent operation
```

The agent arrives near the end of the sequence.

It did not create the separation between the SDK and the application template. It did not decide that wallet ecosystems needed an adapter boundary. It did not invent tenant configuration or the chain-group model.

Those architecture decisions made the workflow possible.

The agent's job is to operate the system correctly:

- collect required decisions
- follow the dependency order
- choose from supported capabilities
- apply changes to a maintained baseline
- stop when information is missing
- produce something that can be validated and reviewed

That is a much narrower role than "build the application for me," and I think it is also a more useful one.

## What changed, and what did not

The workflow changes who performs the repeated coordination work.

Before:

```text
engineer reads requirements
→ asks integration questions
→ clones template
→ selects chain/wallet path
→ configures the app
→ validates
```

With the workflow encoded:

```text
agent collects required decisions
→ applies the known baseline
→ selects a supported integration path
→ makes the bounded changes
→ runs through validation expectations
→ engineer reviews
```

But several things do not disappear:

**Architecture still matters.** If the template has poor boundaries, the agent inherits them.

**Product constraints still matter.** Unsupported wallet combinations do not become supported because a model can write code for them.

**Public APIs still matter.** The baseline is only reusable if the SDK surface remains coherent.

**Human decisions still matter.** Tenant identity, product intent, authentication choices and customer-specific requirements cannot always be inferred safely.

**Review still matters.** Constrained generation reduces the search space; it does not make generated changes intrinsically correct.

Automation did not remove the engineering system. It made that system executable.

## The broader lesson

I used to think of reusable architecture mainly as a maintenance advantage: isolate change, reduce duplication, make the next integration cheaper.

Agent workflows add another test of whether the architecture is actually reusable.

Can the system explain where variation belongs?
Can required decisions be enumerated?
Can invalid transitions be blocked?
Can a known baseline be instantiated without redesigning it?
Can the workflow be evaluated independently of one engineer's memory?

If the answer is yes, the architecture is not only reusable by people. It is structured enough to become an executable process.

That is the part of agent-assisted development I find most durable.

The model will change. The tooling will change. The exact skill format will probably change too.

But a system with a stable core, explicit variation points, constrained decisions and testable outcomes remains useful regardless of who — or what — performs the next integration.
