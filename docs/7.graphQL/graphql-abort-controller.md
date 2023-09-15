---
title: "Gql request cancel"
---

This is WIP.

```tsx
import { GraphQLClient, gql } from "graphql-request";
import { useEffect, useState } from "react";

const endpoint = "https://services-v2.dappio.xyz/graphql";
const query = gql`
  query {
    TokenInfos {
      symbol
      price
    }
  }
`;

const fetchData1 = async (abortController?: AbortController) => {
  /** In GraphQLClient
   * @description we can pass in a abort signal when we create the client
   * - https://github.com/jasonkuhrt/graphql-request/issues/182#issuecomment-668575765
   */
  const graphQLClient = new GraphQLClient(endpoint, {
    signal: abortController?.signal,
  });

  const data = await graphQLClient.request(query);

  return data;
};

const fetchData2 = async (abortController?: AbortController) => {
  /** In each request
   * @description we can also pass in a abort signal when we make the request
   * - https://github.com/jasonkuhrt/graphql-request/pull/303
   */
  const graphQLClient = new GraphQLClient(endpoint);

  const data = await graphQLClient.request(query, {
    signal: abortController?.signal, // or
    // abortController: abortController,
  });
  return data;
};

export default function Home() {
  const [triggerFetch, setTriggerFetch] = useState(false);
  const [triggerFetch2, setTriggerFetch2] = useState(false);
  useEffect(() => {
    const abortController = new AbortController();
    fetchData1(abortController)
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });

    return () => {
      abortController.abort();
    };
  }, [triggerFetch]);

  useEffect(() => {
    const abortController = new AbortController();
    fetchData2(abortController)
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });

    return () => {
      abortController.abort();
    };
  }, [triggerFetch2]);
  return (
    <>
      <button onClick={() => setTriggerFetch((prev) => !prev)}>
        Fetch data #1 (GraphQLClient + signal)
      </button>
      <br />
      <br />
      <button onClick={() => setTriggerFetch((prev) => !prev)}>
        Fetch data #2 (request + signal)
      </button>
    </>
  );
}
```

## Reference

- From client obj (https://github.com/jasonkuhrt/graphql-request/issues/182#issuecomment-668575765)
- From each request (https://github.com/jasonkuhrt/graphql-request/pull/303)
