---
title: Building backend-configured actions without coupling the SDK to a blockchain
description: How I designed SmartLink so backend-defined interactive actions could render through the SDK while wallet connection, signing and transaction submission stayed under host-application control.
date: 2026-02-20
type: project-story
project: sdk-architecture
topics:
  - sdk
  - architecture
  - configuration
  - graphql
  - wallet
featured: false
---

SmartLink started with a product requirement that sounds simple until the SDK boundary becomes part of the design: let a partner define an interactive action in a backend admin experience, render it through the SDK, and allow an end user to execute the action from the host application.

Some of those actions could result in blockchain transactions.

I designed the SDK side of SmartLink around one constraint: **the SDK could describe and initiate an action, but it should not own the customer's blockchain execution environment.**

That decision shaped the client model, the package boundaries, the React API and the way transaction execution was handed back to the host.

## The product shape

The goal was to let configuration live outside the customer's application code.

A partner could define a SmartLink and its actions through backend tooling. The frontend SDK would fetch that configuration and render the corresponding inputs and actions.

At a high level:

```text
Admin / backend
      ↓
SmartLink configuration
      ↓
SDK fetches configuration
      ↓
React renders actions + inputs
      ↓
user executes an action
```

This was important for product velocity. Adding or changing a configured action should not require every host application to hard-code a new UI or ship a new integration just to reflect backend configuration.

But it also created a harder question: what happens when an action needs to produce and execute an on-chain transaction?

## Where I wanted the boundary

It would have been easy to let SmartLink keep expanding until it owned the whole execution path:

```text
SmartLink
  ↓
wallet discovery
  ↓
wallet connection
  ↓
chain-specific signing
  ↓
transaction submission
```

That would make a demo work quickly, but it would also make SmartLink responsible for every wallet and chain decision made by the host application.

The host already knows which wallet system it uses. It already owns connection state, wallet UX, chain selection and transaction submission behavior. Importing those responsibilities into SmartLink would duplicate state machines and couple a backend-configured feature to an unstable wallet ecosystem.

So I kept the boundary narrower:

```text
SmartLink
  ↓
activate configured action
  ↓
backend returns execution payload
  ↓
actionHandler(payload)
  ↓
host application signs / submits
```

The SDK owns the product workflow. The host owns the execution environment.

That is the decision that keeps SmartLink blockchain-agnostic at its public boundary.

## Backend configuration is a contract, not just JSON

The configuration flow crosses several layers:

```text
GraphQL
  → fetch SmartLink configuration

frontend client
  → parse / normalize the domain model

React context
  → store link + action state

components
  → render configured inputs and actions
```

The backend configuration may arrive as serialized data, but I did not want arbitrary JSON leaking through the entire React tree. The SDK parses the response into a known SmartLink model and validates the shape before components depend on it.

That gives each layer a specific responsibility:

- **backend** defines the product configuration
- **client** interprets the configuration as SDK domain data
- **React context** manages interactive state
- **components** render the experience

This is the same principle I prefer elsewhere in SDK design: framework components should consume a domain model, not become the place where backend data is interpreted.

## A separate client for a separate lifecycle

One early design question was whether SmartLink should simply become another method set on `NotifiFrontendClient`.

I chose a sibling client instead.

The normal frontend client had accumulated a lifecycle around user authentication, persisted authorization and broader Notifi application state. SmartLink did not need to inherit that lifecycle just because it talked to some of the same services.

Its needs were narrower. It needed environment and configuration access, and some actions could use lightweight auth parameters such as a wallet public key and blockchain type. It did not need the main client's full persistent session model.

Conceptually:

```text
NotifiFrontendClient
  → long-lived application / user lifecycle

NotifiSmartLinkClient
  → configured action lifecycle
```

Making SmartLink a subclass would have made reuse look elegant in the type hierarchy while coupling it to behavior it did not actually require.

**Similar services do not imply the same lifecycle.** That was the reason to prefer sibling clients over inheritance.

## Why I did not create a completely isolated package

Another possible boundary was a standalone SmartLink package containing its own client, React components, types and styling.

That sounds clean until the dependency graph is drawn.

SmartLink still needed infrastructure that already existed in the SDK:

- shared GraphQL types and services
- frontend domain models
- React context conventions
- theme and CSS-variable infrastructure
- common error and loading behavior

A new package would either duplicate those systems or depend back on the existing frontend and React packages anyway. The isolation would be mostly organizational, not architectural.

Instead, I placed the feature into the layers where each responsibility already belonged:

```text
notifi-graphql
  → SmartLink configuration query

notifi-dataplane
  → action activation request

notifi-frontend-client
  → SmartLink models + client

notifi-react
  → context + components + inputs
```

The feature remained additive. Existing consumers did not need to import it, while the implementation could reuse the SDK's established infrastructure.

## Reads and writes were intentionally different

SmartLink has two service interactions that look related from the UI but have different operational characteristics.

Configuration is a read:

```text
link id
  ↓
GraphQL
  ↓
SmartLink configuration
```

Action activation is a write:

```text
action id + auth params + user inputs
  ↓
dataplane request
  ↓
execution payload + result messages
```

I kept those dependencies explicit in the client rather than hiding them behind one generic service abstraction.

The distinction is useful because the configuration is tenant/link-level data that can be fetched and reused, while action execution is user-specific and may require current wallet identity or other runtime inputs.

An abstraction should remove accidental complexity, not erase meaningful differences between operations.

## State is keyed by the domain, not by component instances

A SmartLink can contain multiple actions, each with its own configured inputs and runtime values. A page can also render more than one SmartLink under the same provider.

I modeled the context state around domain identifiers rather than component-local state:

```text
SmartLinkConfigDictionary
  linkId → configuration

ActionDictionary
  linkId:actionId → action state + user inputs
```

This did two things.

First, configuration could be fetched once and reused by multiple components instead of being tied to whichever component mounted first.

Second, input state had a stable identity even as individual input components mounted or unmounted. Later fixes around initialization and reset behavior reinforced the same idea: **the action state is the source of truth; the input widget is only a view onto it.**

That is a small implementation choice with a large effect on component reliability.

## `preAction` instead of importing wallet state

The host application sometimes needs something to happen before the configured action can execute. The most obvious example is wallet connection.

SmartLink could have added APIs like:

```text
isWalletConnected
connectWallet
selectedChain
openWalletModal
```

I deliberately did not do that.

Instead, the React component exposes a small `preAction` extension point with behavior such as a label, disabled state and click handler. The host can use it to gate execution behind wallet connection or another prerequisite.

That means the SDK can render:

```text
[ Connect wallet ]
```

when the host wants a prerequisite, and then render the normal action once the prerequisite is satisfied — without SmartLink learning anything about the host's wallet implementation.

This is an important design pattern for public SDKs:

> When behavior varies by host application, expose a boundary instead of importing the host's state machine into the SDK.

## Action execution stays chain-agnostic

When the user submits an action, SmartLink validates the configured inputs and sends the action request to the backend/dataplane layer.

A simplified flow is:

```text
user fills configured inputs
      ↓
validate action inputs
      ↓
activate action
  { actionId, authParams, inputs }
      ↓
backend returns result
      ↓
actionHandler(executionPayload)
      ↓
host signs / submits if needed
```

The important part is what is missing from the SmartLink API: there is no EVM-specific signer contract, no Solana wallet adapter and no chain-specific transaction UI.

The backend and client can agree on an execution payload while the host decides how that payload becomes a real transaction in its environment.

That keeps the SDK API stable as wallet integrations evolve independently.

## Hardening the design through real UI behavior

The first version established the architecture, but SmartLink became a production feature through a sequence of smaller refinements:

- action input validation and constraints
- loading and inactive states
- reset behavior
- theme support
- banner and tenant metadata
- pre-action behavior
- better context ownership of fetched configuration
- unit and component coverage
- Cypress coverage for success and failure paths
- explicit handling of unmatched blockchain configuration

Those changes matter because configuration-driven UI has a lot of state that static component APIs do not: defaults, required fields, invalid values, temporarily unmounted inputs, inactive actions and backend-defined variations.

The architecture had to survive those cases without pushing special-case logic back into the host application.

## The broader lesson

SmartLink was not mainly a React component project. The React UI was the visible part of a boundary-design problem.

The design worked because responsibilities stayed separated:

```text
backend
  owns what the action is

SmartLink client
  owns configuration + activation semantics

React layer
  owns rendering + interaction state

host application
  owns wallet / signing / transaction execution
```

The lessons I carried forward were:

- **Backend-driven configuration works best when the SDK interprets it into a real domain model instead of passing raw data through the UI.**
- **Different lifecycle requirements deserve different clients even when they share services.**
- **A package boundary is only useful when it reduces dependencies; a package that immediately depends back on the system it was meant to isolate is usually just indirection.**
- **Host-specific prerequisites should be extension points, not SDK-owned state machines.**
- **Blockchain-agnostic behavior comes from deciding where chain-specific execution stops, not from pretending chains are identical.**

The most important design choice was the simplest one to describe: SmartLink knows how to configure and initiate the action. The application that embeds it remains in control of actually executing it.
