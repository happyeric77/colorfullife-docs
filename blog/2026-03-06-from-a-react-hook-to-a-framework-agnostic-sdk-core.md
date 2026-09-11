---
title: From React hooks to a framework-agnostic SDK client
description: How a React-first SDK optimized for time to market evolved into a reusable domain client as customer integrations expanded beyond React.
date: 2023-09-07
type: project-story
project: sdk-architecture
topics:
  - typescript
  - sdk
  - architecture
  - react
  - graphql
featured: false
---

We did not start with a framework-agnostic client. We started with React because that was where our customers were.

Early on, the product goal was simple: make it as fast as possible for a customer to add Notifi to an existing web application. Most of those applications were built with React, so a React-first SDK was the shortest path to a useful integration. We packaged service access, authentication and subscription behavior behind hooks and paired them with a component library that customers could drop into their applications.

That trade-off worked. It reduced integration work and helped us get the product in front of customers quickly.

The architecture only became a problem after the customer base grew.

## The architecture we optimized for first

The early stack looked roughly like this:

```text
notifi-react-card
      ↓
useNotifiSubscribe
      ↓
useNotifiClient
      ↓
useNotifiService
      ↓
Notifi API
```

The hooks were not just React bindings. Over time they accumulated responsibilities that belonged to the product domain:

- authentication and token state
- targets and target groups
- alert creation and subscription behavior
- notification history
- configuration fetching and interpretation
- chain-specific signing behavior
- orchestration across service calls

For a React application this was convenient. The component could call a hook, the hook knew how to perform the operation, and the customer did not need to understand the underlying service model.

The problem was that the business logic and the framework boundary had become the same thing.

## Success changed the constraint

As integrations expanded, React was no longer a safe assumption. Some customers used Vue. Others used Angular. Some wanted to integrate the service without adopting our React component library at all.

At that point the existing API had an architectural limitation: even when the operation itself had nothing to do with React, consuming it meant pulling in a React-specific layer.

The problem was not that hooks were inherently wrong. They were the right optimization for the first customer set. The problem was that they had become the owner of domain behavior that other frameworks also needed.

Splitting one large hook into more hooks would not solve that. `useAuth`, `useAlerts` and `useTargets` would be cleaner React code, but the product model would still be trapped behind React lifecycle and context.

The boundary needed to move.

## The target architecture

The consolidation plan was to make `notifi-frontend-client` the owner of frontend domain behavior and let React consume it like any other client:

```text
React SDK ─────────┐
Vue integration ──┼──→ NotifiFrontendClient ──→ Notifi services
Angular app ───────┤
plain TS / JS ─────┘
```

The key distinction was responsibility.

`NotifiFrontendClient` would own things that should behave the same regardless of UI framework:

```text
authentication state
configuration interpretation
alerts and subscriptions
targets and target groups
notification history
storage
service orchestration
chain-specific domain behavior
```

Framework packages would own the things that actually are framework-specific:

```text
rendering
context / providers
component state
framework lifecycle
UI composition
```

This was more than converting hooks into class methods. It was turning React from the location of the SDK's business logic into one consumer of a stable domain API.

## Building the client before replacing the hooks

The new client was introduced gradually rather than as a rewrite.

The first `notifi-frontend-client` work established a TypeScript API facade over the GraphQL service. Its intended direction was already broader than React: business logic should be reusable across frontend frameworks and, where possible, across blockchain integrations.

The next step was capability parity. Before the React stack could depend on the client, the client had to cover the behavior that the hooks already provided.

That meant moving or consolidating operations such as:

- initialization and persisted auth state
- login and logout
- target-group operations
- alert creation and deletion
- subscription-card configuration
- notification history
- wallet-related subscription behavior
- conversation operations used by support UI

It also meant expanding the client across the event types and chains that the existing React packages already supported. A framework-agnostic abstraction is not useful if customers still have to fall back to a React hook whenever they hit an older feature.

## Configuration became a domain concern

One important part of the extraction was configuration.

The backend already stored tenant-level configuration for embeddable experiences. Instead of making each React component understand the raw backend shape, `NotifiFrontendClient` became the layer that fetched and interpreted that configuration.

A simplified flow became:

```text
Backend TenantConfig
       ↓
fetchSubscriptionCard()
       ↓
CardConfigItemV1
       ↓
EventTypeItem
       ↓
FrontendClient operations
       ↓
React renders the experience
```

That separation matters because backend-driven UI is much easier to evolve when the rendering framework is not also responsible for interpreting the product domain.

The backend can own **what is configured**. The client can own **what that configuration means operationally**. React can own **how it is presented**.

This also reduced duplicated models. During the migration, React components increasingly consumed the types and configuration models exposed by the frontend client instead of maintaining parallel representations.

## Migrating a live SDK without a big-bang cutover

The most important design decision was not the client class itself. It was the migration path.

Existing customer integrations already depended on the hooks and React card packages. Replacing their implementation in one release would have made every behavioral mismatch a customer-facing regression.

So the migration moved in independently shippable stages:

```text
build FrontendClient capability parity
        ↓
consolidate shared domain types
        ↓
move configuration and data fetching
        ↓
move subscription and target operations
        ↓
let React support both implementations
        ↓
make FrontendClient the default
        ↓
keep the hooks path as a fallback
        ↓
remove legacy packages after the new path is established
```

During 2023 the React card progressively gained a `frontendClient` path for fetching data, rendering subscription state and executing individual event-type operations. For a period, components could run either implementation.

That duplication was intentional. It created a compatibility window where we could compare behavior and fix gaps without forcing every customer onto the new architecture at once.

Later that year, the default flipped: React used `FrontendClient` unless an integration explicitly chose the legacy hooks path.

That was the real migration milestone. The new client was no longer an experiment running next to the SDK; it had become the SDK's default domain implementation while the old path remained available as a safety valve.

## The awkward middle was part of the design

Running two implementations introduced its own problems.

Initialization order mattered. React could not safely render children before the frontend client had restored its state. There were also cases where both the hook path and the frontend-client path could trigger rendering work, creating race conditions or duplicate updates.

Those issues are easy to interpret as evidence that a migration should have been done all at once. I see them differently. They were the cost of preserving compatibility while changing a public SDK underneath live integrations.

The important part was keeping that period temporary and directional: every new piece of business logic moved toward the client, not back into the hooks.

## Completing the transition

The framework-agnostic client eventually became the foundation for the newer `notifi-react` package as well as other integrations. By 2024 the old stack — including `notifi-react-hooks`, the legacy React card, the old core and Axios adapter packages — could be deprecated and removed from the workspace.

The resulting architecture was much simpler conceptually:

```text
Framework / application layer
        ↓
NotifiFrontendClient
        ↓
GraphQL + service layer
```

React still had a first-class integration. It just no longer defined the SDK's domain architecture.

That distinction became increasingly valuable as the product expanded. New authentication flows, target types, wallet behavior and backend configuration could evolve in the client without requiring the domain implementation to be rewritten around a React hook.

## What I took away

**Optimize for the market you have, but know which decisions are temporary.** Starting with React was the right time-to-market decision. Treating React as the permanent owner of business logic would not have been.

**Framework APIs should orchestrate UI, not own domain behavior.** Hooks are a good ergonomic surface. They are a poor portability boundary when every important operation only exists inside them.

**A client facade should model product concepts, not just wrap HTTP calls.** The value of `NotifiFrontendClient` came from giving authentication, subscriptions, targets and configuration a stable API independent of React and transport details.

**Migration compatibility is part of architecture.** Supporting the old and new implementations side by side was not elegant, but it made the boundary movable without turning the refactor into a coordinated customer migration.

**The clean architecture is usually the end state, not the starting point.** The useful question is not whether the first version was perfectly decoupled. It is whether the system can evolve when the assumptions that made the first version successful stop being true.
