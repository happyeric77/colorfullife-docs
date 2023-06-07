---
title: Expend accessible-scope of context
---

# Expend accessible-scope of useContext

In some certain cases, the dapp page might want to be grainted access to consume the following contexts:

1. `NotifiSubscriptionContext` --> `useNotifiSubscriptionContext()`
2. `NotifiClientContext` --> `useNotifiClientContext()`

However, these two contexts are only available inside the `NotifiSubscriptionCard` component

:::info

Reason: they are wrapped inside the `NotifiSubscriptionCard` component.

:::

The real use case is like below:

- Toggle to subscribe alert outside of card

![](https://image-server.dev-eric.ml/docs-sdk-tashi-context.png)

- Press button to subscribe alert outside of card

![](https://image-server.dev-eric.ml/docs-sdk-suins-context.png)

## [SDK] Consolidate `NotifiSubscriptionContextProvider` and `NotifiFormProvider`

The scope includes:

- Move the `NotifiSubscriptionContextProvider` and `NotifiFormProvider` into `NotifiContext`
- Consolidate `NotifiSubscriptionCard` and `NotifiSubscriptionCardContainer`

### Step#1: NotifiContext

```tsx title="packages/notifi-frontend-client/lib/contexts/NotifiContext.tsx"
// add-start
<NotifiFormProvider>
  <NotifiSubscriptionContextProvider {...params}>
    {/* add-end */}
    <NotifiClientContextProvider {...params}>{children}</NotifiClientContextProvider>
    {/* add-start */}
  </NotifiSubscriptionContextProvider>
</NotifiFormProvider>
// add-end
```

Then in dapp side, we can simply use the `NotifiContextProvider` to wrap the component that might want to consume the context (ex. `App.tsx` in case whole app needs to consume the context)

### Step#2: Consolidate `NotifiSubscriptionCard` and `NotifiSubscriptionCardContainer`

After Step#1, we can now consolidate the `NotifiSubscriptionCard` and `NotifiSubscriptionCardContainer` into one component.

### Step3: Update the `notifi-react-example` showcasing the way to use the context outside of `NotifiSubscriptionCard` (SolanaCard)

In the case we want to use the `NotifiSubscriptionContext` and `NotifiClientContext` in `SolanaCard` page, we will need to create a wrapper to wrap the `SolanaCard`.

```tsx title="SolanaNotifiContextWrapper.tsx"
export const SolanaNotifiContextWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  // TODO ...
  return (
    <div className="container">
      {/* TODO ... */}
      <NotifiContext
        dappAddress="junitest.xyz"
        walletBlockchain="SOLANA"
        env="Development"
        walletPublicKey={publicKey}
        hardwareLoginPlugin={hwLoginPlugin}
        signMessage={signMessage}
      >
        <WalletConnectButton />
        {children}
      </NotifiContext>
      {/* TODO ... */}
    </div>
  );
};
```

Then We can wrap the `SolanaCard` with `SolanaNotifiContextWrapper`.

```tsx title="packages/notifi-react-example/src/NotifiCard/NotifiCard.tsx"
// ...
const supportedViews: Record<ESupportedViews, React.ReactNode> = {
  [ESupportedViews.DemoPreview]: <DemoPrviewCard />,
  [ESupportedViews.Solana]: (
    // add-next-line
    <SolanaNotifiContextWrapper>
      <SolanaCard />
      // add-next-line
    </SolanaNotifiContextWrapper>
  ),
  [ESupportedViews.WalletConnect]: <WalletConnectCard />,
  [ESupportedViews.Polkadot]: <PolkadotCard />,
  [ESupportedViews.Sui]: <SuiNotifiCard />,
  [ESupportedViews.Keplr]: <KeplrCard />,
};
// ...
```

Finally, we can use the `useNotifiSubscriptionContext` and `useNotifiClientContext` in `SolanaCard` page.

:::info

Here we check if the `client` is initialized and authenticated, then we can show the list of alerts.

:::

```tsx title="packages/notifi-react-example/src/NotifiCard/SolanaCard.tsx"
// ...
const { alerts } = useNotifiSubscriptionContext();
const { client } = useNotifiClientContext();
// ...
return (
  <div className="container">
    {/* TODO: Other corresponding changes... */}
    {/* add-start */}
    <h3>Display NotifiSubscriptionCard</h3>
    {client.isInitialized && client.isAuthenticated ? (
      <div>
        <ul>
          {Object.keys(alerts).length > 0 &&
            Object.keys(alerts).map((alert) => (
              <li key={alerts[alert]?.id}>
                <div>{alerts[alert]?.name}</div>
              </li>
            ))}
        </ul>
      </div>
    ) : (
      <div>Not yet register Notification</div>
    )}
    {/* add-end */}
    <NotifiSubscriptionCard
    // ...
    />

    {/* TODO: Other corresponding changes... */}
  </div>
);
```

## [SDK] Finalize example for the rest of supported chains

Just repeat the same steps as above for other supported chains:

- `KeplrCard.tsx`
- `PolkadotCard.tsx`
- `SuiNotifiCard.tsx`
- `WalletConnectCard.tsx`
