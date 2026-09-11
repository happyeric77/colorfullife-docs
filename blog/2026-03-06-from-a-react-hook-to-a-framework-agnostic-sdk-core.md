---
title: From a React hook to a framework-agnostic SDK core
description: Why a single React hook became hard to maintain at scale, and how it was extracted into a framework-agnostic TypeScript client without breaking live integrations.
date: 2026-03-06
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

Every SDK starts with a trade-off. Ours was explicit: ship the fastest possible integration path, and defer the architecture until the product had customers.

## The starting point

The first version of the SDK was a single React hooks package. One hook owned almost everything:

- API communication over REST, with hand-written request and response types
- multi-chain wallet signing adapters
- auth and token lifecycle
- loading and error state
- business logic

For a small startup this is a reasonable design. It maximizes time to market and minimizes integration friction: a partner installs one package, mounts a provider, and the hook does the rest.

## Where it started to hurt

Three problems appeared as the product grew.

**Framework lock-in.** All logic was bound to the React lifecycle. Anything that was not React — a Vue or Svelte integration, a script, a background worker — could not reuse the SDK at all.

**Maintenance burden.** Ten-plus supported chains turned the hook into a giant switch-case abstraction. Responsibilities blurred: API concerns, signing concerns and UI state lived in the same file.

**Testability.** Testing business logic required mounting React components. That made tests slow and brittle, and it quietly discouraged coverage.

## The constraints

The migration had to be done by one engineer, alongside normal feature delivery. Live customers were running the old architecture in production, so downtime was not an option. There was no hard deadline, but there was also no freeze: the new architecture had to coexist with the old one, and customers could adopt it at their own pace.

## The options

**Split the hook into smaller hooks** — `useAuth`, `useSigning`, `useAlerts`. Rejected: the logic stays React-bound, so the framework lock-in and testability problems remain. It only delays them.

**A framework adapter over a monolithic core** — invert the dependency but keep the core shaped by one framework's needs. Rejected: every supported framework becomes another maintenance surface.

**A pure TypeScript client with thin framework wrappers.** Chosen. The core owns the logic; React, Vue or anything else becomes a small adapter.

## The extraction

The core became a standalone TypeScript package: a client class owning the auth state machine, wallet signing adapters, the API layer and the token lifecycle. It has no React dependency and runs anywhere JavaScript runs.

Around the same time, the communication layer moved from REST to GraphQL. Hand-maintained types were replaced by code generation against the schema. That eliminated a class of schema drift bugs and reduced cross-team coordination cost — the types could no longer disagree with the API.

The migration itself ran in three phases:

1. **Coexistence.** The old hooks and the new client lived side by side inside the existing React package. Customers were unaffected.
2. **New surface.** A new React package was built entirely on the new core, replacing the old one.
3. **Removal.** Once the last customers had migrated, the legacy packages were removed in a major version.

## The outcome

The SDK became a platform core: one place for auth, signing and API logic, usable from any framework or no framework at all. The full migration took about three quarters with zero downtime. Adding a chain no longer means touching React code, which cuts regression risk.

## What I would do differently

- Decouple earlier. The pain was predictable; waiting for it to become acute cost more than starting the extraction would have.
- Treat a framework-agnostic core as a day-one principle, not a later refactor.
- Define a formal deprecation policy before the first breaking change.
- Run integration tests that exercise the old and new paths side by side during coexistence. Behavioural drift between them is the biggest risk in this kind of migration, and it stays invisible until a customer hits it.

Migrating a live SDK is mostly a communication problem wearing an architecture costume. Phased, independently shippable steps are what make it survivable — especially when there is only one engineer.
