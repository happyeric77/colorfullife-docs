---
title: Backend-driven configuration for an embeddable SDK
description: Letting dApp developers define interactive on-chain actions in a backend admin panel, and rendering them through an SDK without coupling the SDK to any blockchain.
date: 2026-02-20
type: project-story
project: sdk-architecture
topics:
  - sdk
  - configuration
  - graphql
featured: false
---

Most SDK features are designed in code. This one was designed so that partners could define it in an admin panel.

The feature lets dApp developers configure interactive on-chain actions through a backend UI and render them as components through the SDK. When a user clicks an action, the SDK asks the backend for a serialized transaction, hands it to the host application, and lets the host sign and submit it. The feature went from a spike in late March 2025 to production in May 2025.

## The constraints

- **Time to market.** The product team wanted a fast delivery path, which initially pushed the design toward a brand-new package.
- **No breaking changes.** Existing consumers of the client and React packages could not be affected.
- **Blockchain-agnostic.** The action-execution layer could not be tied to EVM, Solana, SUI or anything else; the SDK should return a transaction payload and let the host handle signing.
- **A different auth model.** The feature does not require a logged-in user session. It only needs `authParams` — a wallet public key and a blockchain type — to sign the activation request.

## The options

**A new package.** The original proposal was a separate package containing the UI components and a new client. On paper this avoids touching existing packages and gives clean separation.

The problems only show up when you draw the dependency graph:

- The UI needs types and the client from the existing frontend package, plus React context patterns — theme support, error views, CSS variables — that already live in the React package. It would either duplicate them or depend on the package it was trying to stay separate from.
- Cross-package type imports were already fragile. One shared types package was importing `AuthParams` from the client package and had to use `import type` to avoid a circular dependency. Another package in the graph would have turned a line into a mesh.
- The maintenance overhead would be real, and the isolation would be an illusion.

**Integrate into the existing packages.** Add a GraphQL query to the API package, a REST call to the dataplane package, a sibling client to the frontend package, and a context plus components to the React package.

This was the proposal I wrote up and brought to the team. The key realization: the feature is purely additive. New exports cannot break existing consumers, so the "no breaking changes" argument for a separate package was a false constraint.

**Decision: integrate.** The `no breaking changes` risk was not real, and the code would immediately want to cross the package boundary anyway. The accepted trade-off is a slightly larger React package, mitigated by tree-shaking — consumers who do not import the feature don't pay for it.

## Design decisions

**A sibling client, not a subclass.** The feature has a fundamentally different auth model: no persistent session, no storage. Making it a subclass of the main client would have forced it to inherit behaviour it must not have. It became a sibling with a much lighter configuration:

```ts
type LinkClientConfig = {
  env?: Environment;
  authParams: AuthParams;
};
```

**The SDK never touches the wallet.** The backend returns a serialized transaction; the SDK passes it to the host through an `actionHandler` callback. The host signs and submits. This is what keeps the feature blockchain-agnostic at the API boundary.

**Reuse the existing UI infrastructure.** Theme support, error views, CSS variables and the established `classNames` override pattern all came from the React package instead of being reimplemented.

## How it works

The feature is split across four layers:

```text
api package      → a GraphQL query for the link configuration
dataplane package → a REST call to activate an action
frontend package  → models + a client + a factory function
react package     → a context provider + components + input widgets
```

The data flow:

```text
User visits the link URL
  → provider initializes the link client
  → component mounts and fetches the config
      → GraphQL returns the raw config as a JSON string
      → JSON.parse + a type guard validate it
  → context stores the config per link id
  → action state is initialized with default inputs per action

User fills in inputs and clicks an action
  → the action validates that the blockchain type matches the config
  → the client POSTs { actionId, authParams, inputs } to the dataplane
  → the response carries transactions plus success/failure messages
  → actionHandler(payload) — the host signs and submits
```

Three details worth copying:

**Dictionaries keyed by id.** The context holds configs keyed by link id and action state keyed by `${linkId}:${actionId}`. A single provider can serve multiple components on the same page without refetching anything.

**Dual service injection.** Config fetch is a GraphQL read (cacheable, tenant-level). Action execution is a REST write (user-specific, requires auth params). The client takes both services explicitly rather than hiding the difference.

**A `preAction` prop.** The component accepts an optional pre-action with `disabled`, `label` and `onClick`. This lets the host gate execution behind a wallet-connection step without the SDK knowing anything about wallet state. If it is omitted, the action button executes directly.

## Outcome

The feature shipped to production in May 2025 with zero breaking changes. The cross-package circular dependency was avoided with type-only imports, and a component test covered the new UI. One post-launch fix was needed: the dataplane endpoint path was case-sensitive and the deployment had it capitalized; the client was corrected to match.

## What I took away

- For an additive feature, "we might break something" is rarely a reason to create a new package. New exports are safe by construction.
- Draw the dependency graph before choosing the boundaries. A package that must depend on the thing it is supposed to be isolated from is just indirection.
- Two different auth models deserve two sibling clients, not inheritance.
- Letting the host sign the transaction is what makes a feature blockchain-agnostic. That is an API-boundary decision, not a refactor.
