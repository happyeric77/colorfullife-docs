---
title: "GraphQL Codegen: ts-sdk"
---

# Generate fully typed graphQL SDK with graphql-codegen

By using `@graphql-codegen/typescript-graphql-request` [plugin](https://the-guild.dev/graphql/codegen/plugins/typescript/typescript-graphql-request#usage-example), we can generate a fully typed graphQL SDK for our graphQL queries and mutations.

We can wrap the GraphQLClient object with the auto generated `getSDK` function to get a fully typed SDK for our graphQL queries and mutations.

## Setup basic dependencies to enable graphQL queryable client environment

```bash
mkdir gql-codegen
cd gql-codegen
yarn init -y
yarn add graphql-request graphql
```

## Install needed graphQL codegen plugins and config

1. `@graphql-codegen/cli` & `@graphql-codegen/typescript`: the base dependencies.
2. `@graphql-codegen/typescript-operations`: Allow sdk to operate on graphQL operations.
3. `@graphql-codegen/typescript-graphql-request`: Generate the SDK for graphQL queries and mutations.

```bash
yarn add -D @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-graphql-request @graphql-codegen/typescript-operations
```

## Setup config file

```ts title="codegen.ts"
import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  documents: ["src/**/*.ts"],
  schema: "https://services.dappio.xyz/graphql",
  generates: {
    // highlight-start
    "./src/generated.ts": {
      plugins: ["typescript", "typescript-operations", "typescript-graphql-request"],
    },
    // highlight-end
  },
};

export default config;
```

## Create the reference to generate SDK

graphql-codegen will generate the SDK according to the query that we define in the `documents` field in the config file.

So we need to create a file that contains the query that we want to generate the SDK for.

```ts title="src/gql/query/tokenInfos.gql.ts"
import { gql } from "graphql-request";

export const tokenInfoQuery = gql`
  query getTokenInfo($symbol: String!) {
    TokenInfos(symbol: $symbol) {
      timestamp
      price
      protocol
      chainId
      mint
      name
      decimals
      symbol
      logoURI
    }
  }
`;
```

And then we can run the `yarn codegen` again to generate the `generated.ts` file.

## Use the generated SDK

```ts title="src/index.ts"
import { GraphQLClient } from "graphql-request";
import { getSdk } from "./generated";

const endpoint = `https://services.dappio.xyz/graphql`;

const client = new GraphQLClient(endpoint);

const sdk = getSdk(client);

const variables = {
  symbol: "ETH",
};

sdk.getTokenInfo(variables).then((data) => console.log(data));
```

As can be seen from the above code, we can use the generated SDK to query the graphQL endpoint with the fully typed return value.

```ts title="src/generated.ts"
// ...
export type GetTokenInfoQuery = {
  __typename?: "Query";
  TokenInfos?: Array<{
    __typename?: "TokenInfo";
    timestamp?: string | null;
    price?: number | null;
    protocol?: string | null;
    chainId?: string | null;
    mint?: string | null;
    name?: string | null;
    decimals?: number | null;
    symbol?: string | null;
    logoURI?: string | null;
  } | null> | null;
};

// ...
```

Awesome! Let's try to run and see the result. Congratulations! 🎉🎉🎉🎉🎉🎉🎉🎉

## Reference

If you come across the following error:

:::danger

```bash
$ ts-node src/index.ts
/usr/local/lib/node_modules/ts-node/src/index.ts:744
return new TSError(diagnosticText, diagnosticCodes);
^
TSError: ⨯ Unable to compile TypeScript:
src/generated.ts:2:22 - error TS2307: Cannot find module 'graphql-request/dist/types.dom' or its corresponding type declarations.

2 import \* as Dom from 'graphql-request/dist/types.dom';
                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

at createTSError (/usr/local/lib/node_modules/ts-node/src/index.ts:744:12)

```

:::

It's because the `graphql-request` package has been updated to version 5.1.1, which has removed the `dist/types.dom` file.

To fix this, we have to downgrade the `graphql-request` package to version 5.1.0.

See the reference [HERE](https://stackoverflow.com/questions/75652477/graphql-code-generator-typescript-graphql-request-generates-sdk-with-invalid-i)

:::info

Checkout the [full code](https://github.com/happyeric77/gql-codegen/releases/tag/v3.0.0-ts-graphql-request) here.

<iframe width="560" height="315" src="https://www.youtube.com/embed/Wt7qStC_dac" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

:::
