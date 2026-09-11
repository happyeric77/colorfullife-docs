---
title: Modernizing wallet connectivity with EIP-6963
description: A wallet extension stopped injecting its custom global and the connect flow broke. Fixing it meant moving the whole wallet layer to standard discovery.
date: 2026-04-01
type: build-log
project: sdk-architecture
topics:
  - wallet
  - react
  - sdk
  - ethereum
featured: false
---

Wallet integrations age badly. One vendor-specific global can disappear in a single extension update — and when it does, the failure looks like a bug in your product.

## The symptom

Customers reported the same thing: install the new version of a wallet extension, open the dapp, click the wallet tile in the connect modal — and get redirected to the wallet vendor's homepage instead of connecting.

The modal was behaving exactly as written. It could not find the wallet, so it assumed the extension was missing and offered to install it.

## The root cause

The SDK had a dedicated integration for this wallet, built around a custom global that old versions injected into the page. Every detection path led back to that global:

```ts
const getWalletFromWindow = async () => {
  if (typeof window === 'undefined' || !window.WalletGlobal) {
    throw new Error("wallet is not installed");
  }
  // ...
};
```

The new wallet release moved to MPC-based key management and stopped injecting the legacy global entirely. By then the old extension was already on its way out: the vendor had stopped shipping updates for it, with store removal announced for the following month.

What the new wallet does instead is announce itself through **EIP-6963**, the discovery standard for injected wallets: every provider dispatches an announcement event carrying metadata, including an `rdns` identifier and a display name. Wallets that never touch a custom global are still discoverable — if you listen for announcements.

Wallet detection was vendor-shaped. The standard existed precisely to avoid that.

## The fix

The SDK already had a generic injected-wallet path that listens for EIP-6963 announcements and matches a wallet by substring on `rdns` or name:

```ts
providers.find(
  (p) =>
    p.info?.rdns?.toLowerCase().includes(walletName.toLowerCase()) ||
    p.info?.name?.toLowerCase().includes(walletName.toLowerCase()),
);
```

The fix was two lines of substance: move the wallet from the dedicated legacy hook to the generic injected hook, and update the install URL to point at the current wallet. The public interface did not change at all.

## The cleanup that followed

The incident exposed how much dedicated machinery existed for a single wallet:

- a legacy hook of a few hundred lines, no longer imported by anything
- a dedicated wallet class separate from the generic EVM wallet
- registry entries: a standalone category, and the wallet listed as a native integration instead of an injected one
- a special case in the wallet instance factory
- tests for all of the above

With the wallet flowing through standard discovery, none of it was necessary. The registry now treats it like any other injected EVM wallet: no special category, no special hook, no special factory branch.

While in there, the type layer was renamed to describe the chain family instead of a wallet implementation — EVM keys, Cosmos keys, Solana keys, Cardano keys. The rename has no runtime impact, but it stops the public types from baking vendor names into anything that imports them. Removing the dedicated class from the public package is a breaking change for the small set of consumers importing it directly, so it ships with the next major version and a short migration note.

## What this taught us

- **Prefer standards-based discovery.** EIP-6963 exists so integration code does not depend on whichever global a vendor injected this year.
- **One integration per wallet does not scale.** A registry entry plus a generic path covers wallets that follow the standard; dedicated code is for genuinely special cases.
- **Fix the incident and the cleanup together.** The "small fix" turned out to be the front door to removing hundreds of lines of abstraction. Left separate, the cleanup would probably never have happened.
- **Name types after concepts, not vendors.** Chain families are stable; wallet branding is not.
