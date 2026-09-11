---
title: Turning an SDK into a reusable customer integration template
description: How a library-first integration model evolved into a configurable full-page application that could be branded, deployed and self-hosted without rebuilding the same product for every customer.
date: 2024-04-08
type: project-story
project: sdk-architecture
topics:
  - sdk
  - architecture
  - react
  - typescript
featured: false
---

An SDK is a good delivery mechanism when the customer already has an application and wants to embed your product into it. It is a much less complete answer when the customer wants you to deliver the application too.

That distinction changed how I thought about the frontend surface around our SDK.

At Notifi, the original integration model was straightforward: we shipped client and React SDKs, and customers embedded notification functionality into their own web applications. The SDK owned the product logic; the customer owned the surrounding experience.

Then a different requirement started appearing. Some customers did not want another component to integrate. They wanted a complete page they could send their users to: connect a wallet, authenticate, configure notification subscriptions and talk to the same Notifi backend without first building an application around the SDK.

The obvious implementation was also the wrong long-term one: build a new app for every customer.

## The repeated work was the signal

A customer-specific full-page integration has obvious differences:

- branding and visual style
- tenant credentials
- notification configuration
- blockchain and wallet expectations
- page copy

But most of the application does not change:

- authentication flow
- SDK/provider wiring
- subscription state
- notification configuration UI
- routing
- loading and error handling
- deployment shape

If every customer starts from an empty repository, the stable 80 percent gets rewritten because the variable 20 percent looks different.

That is not customization. It is duplication with a different logo.

The boundary I wanted was the opposite: keep the product flow stable and make customer-specific variation explicit.

## A full-page example became the reusable baseline

The result was [`notifi-dapp-example`](https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages/notifi-dapp-example), a Next.js application inside the public SDK monorepo.

The name says "example", but its role grew beyond documentation. It serves two related use cases:

1. a runnable reference for developers learning how the SDK pieces fit together
2. a baseline application that can be cloned, branded and configured for a customer deployment

That dual purpose matters. A conventional example usually optimizes for readability and throws away production concerns. A customer template has to survive them: environment configuration, real authentication, error states, deployment and continued SDK evolution.

Instead of forking core business logic, the application consumes the public SDK packages just like an external integration would. That keeps the template honest. If the public integration surface becomes difficult to use, the example feels the pain too.

## Put variation into configuration

The next question was deciding what should require code changes.

The application exposes customer-specific values through configuration rather than scattering them through components. The public example includes variables for things such as:

```text
tenant
runtime environment
blockchain
subscription card
page title
page subtitle
```

That is a small design decision with a large operational effect.

For a normal customer variation, the workflow becomes roughly:

```text
stable application baseline
        +
customer configuration
        +
brand styling
        =
customer deployment
```

The application architecture is no longer part of every customization project.

This also gives customers a useful escape hatch. If they want to host the experience themselves, the same public application shows a complete Next.js implementation rather than only a collection of SDK snippets. They can inspect it, run it and adapt it without depending on an internal codebase.

## Deployment is part of the template

A reusable application is not reusable if every fork needs a new deployment design.

The public package therefore also documents a deployment path built around development and production environments. The application configuration is passed through environment variables, and the deployment flow can build the app and publish the resulting assets through the same repeatable pipeline.

This is an important distinction between a sample and a delivery baseline:

```text
sample
→ demonstrates an API

template
→ demonstrates the API
→ defines configuration boundaries
→ defines operational expectations
→ can become a real deployment
```

Once deployment is repeatable, customer work moves away from infrastructure invention and toward the places where customization is actually valuable.

## Wallets were the remaining source of structural variation

Branding and credentials are easy to parameterize. Wallet authentication is harder.

A customer on an EVM chain may expect MetaMask or WalletConnect. A Solana integration may need Phantom. A Cosmos integration may use Keplr. Other ecosystems have different wallet APIs, address formats and signing behavior.

If the template handled those differences directly, every new wallet would spread another branch through the application:

```text
if EVM ...
if Solana ...
if Cosmos ...
if Cardano ...
```

At that point the reusable shell stops being reusable.

So wallet variability became a separate package boundary: `@notifi-network/notifi-wallet-provider`.

The full-page application consumes a normalized wallet layer; the provider package absorbs wallet- and chain-specific behavior. A new customer can therefore change the supported wallet set without replacing the application's authentication architecture.

That separation turned out to be one of the most important parts of making the template durable.

## The architecture became a delivery system

The useful mental model is not "SDK plus example app." It is a set of integration levels built on the same product surface:

```text
Notifi SDK
   │
   ├── embed into an existing application
   │
   └── reusable full-page application
          │
          ├── customer-hosted
          ├── provider-hosted
          └── customized through explicit variation points
```

The SDK remains the source of product behavior. The full-page app provides a stable integration shell. The wallet layer isolates one of the messiest external dependencies. Configuration carries the customer-specific values.

No layer needs to pretend every customer is identical, but customer differences no longer force us to redesign the entire system.

## What I learned

The main lesson was that reusable software is less about identifying identical code than identifying **where variation is allowed to enter the system**.

A template with dozens of customer-specific conditionals is only a shared repository. A reusable integration platform has a stable center and explicit extension points.

For this system, those extension points became:

- configuration for tenant and product behavior
- styling for customer identity
- a wallet-provider boundary for chain-specific authentication
- public SDK APIs for the underlying notification product

That made the same codebase useful as documentation, as a starting point for self-hosting and as the baseline for repeated customer delivery.

The interesting part was never the fact that we had an example application. It was turning repeated implementation work into an architecture where the next integration was mostly configuration instead of reinvention.
