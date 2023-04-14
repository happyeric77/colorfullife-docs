---
title: Disable certain Nextjs page SSR
---

# Disable certain Nextjs page SSR

You might sometimes come across a situation where you want to disable SSR for a certain page in Nextjs. This is a common scenario when you are using a third party library that is not compatible with SSR.

The following error is what I have encountered when I tried to use the @mysten/wallet-kit library in Nextjs:

:::danger

Unhandled Runtime Error
Error: Hydration failed because the initial
UI does not match what was rendered on the server.
Warning: Expected server HTML to contain a matching < button > in < div >.
See more info here:
https://nextjs.org/docs/messages/react-hydration-error

:::

The solution is to disable SSR for the page that uses the library.

## Create a React component Wrapper

All children components of the wrapper will have SSR disabled. So, we name it NoSSRWrapper.

```tsx title="NoSSRWrapper.tsx"
import dynamic from "next/dynamic";
import React, { FC, PropsWithChildren } from "react";

const NoSSRWrapper: FC<PropsWithChildren> = (props) => <>{props.children}</>;

export default dynamic(() => Promise.resolve(NoSSRWrapper), {
  ssr: false,
});
```

We make use of the dynamic import feature. The dynamic import feature allows us to import a module dynamically behaving in a certain way that we specify. In this case, we specify that the module should not be rendered on the server side `ssr: false`.

## Wrap the page with the NoSSRWrapper

We decide which page (including its children) to disable SSR for. In this case, we wrap the entire app with the NoSSRWrapper.

```tsx title="index.tsx"
import NoSsrWrapper from "../components/noSsrWrapper";
import { SuiWalletContextProvider } from "../context/suiWalletContextProvider";
import "../styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NoSsrWrapper>
      <Component {...pageProps} />
    </NoSsrWrapper>
  );
}
```

And the SSR feature is disabled for the entire app.

:::info

The example of my PoC project [repo](https://github.com/happyeric77/sui-multi-wallet.git)

:::
