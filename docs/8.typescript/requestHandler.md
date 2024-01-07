---
title: "Request Handler - Axios"
tags: [typescript, axios]
---

When we want to create our lightweight SDK without using any third-party libraries, we might want to create a request handler to handle the api requests in a controllable and predictable way.

In this article, we will refactor [ms365-graph-api-auth](https://github.com/happyeric77/colorfullife/tree/master/packages/ms365-graph-api-auth) npm package by creating a request handler.

:::tip
Checkout this [PR](https://github.com/happyeric77/colorfullife/pull/4) to see the detailed refactoring process.
:::

There are two key benefits of using a request handler:

1. It will be easier to follow the convention if someone wants to contribute to the project.
2. It is easier to handle the error.
3. It is more type-safe and predictable since we can define the type of the response data.

### Create a request handler helper function

This helper function can take a request function and return a function that can handle the request and return a response with the corresponding type.

```ts title="packages/ms365-graph-api-auth/utils/requestHandler.ts"
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

type BaseRequest<U, T = AxiosRequestConfig> = (
  params?: T
) => Promise<AxiosResponse<U>>;

type BaseResponse<U, E = AxiosError> = Promise<
  SuccessResponse<U> | ErrorResponse<E>
>;

type SuccessResponse<U> = {
  success: true;
  data: U;
};

type ErrorResponse<E> = {
  success: false;
  error: E;
};

type RequestHandler = <U, T = AxiosRequestConfig, E = AxiosError>(
  request: BaseRequest<U, T>
) => (params?: T) => BaseResponse<U, E>;

export const getRequestHandler: RequestHandler =
  <U, T = AxiosRequestConfig, E = AxiosRequestConfig>(
    request: BaseRequest<U, T>
  ) =>
  async (params?: T): BaseResponse<U, E> => {
    try {
      const response = await request(params);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error as E,
      };
    }
  };
```

### Use the request handler helper function

```ts title="packages/ms365-graph-api-auth/src/fetch.ts"
  // ...
  aasync getSites(siteName?: string): Promise<ISites> {
    const baseApiUrl = "https://graph.microsoft.com/";

    const getSharePointSites = getRequestHandler<ISites>((params) =>
      axios.get(baseApiUrl + "v1.0/sites", params)
    );

    const params: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    };

    const res = await getSharePointSites(params);
    //                 ^^^^^ getSharePointSites: (params?: AxiosRequestConfig<any> | undefined) => BaseResponse<ISites, AxiosError<unknown, any>>

    if (!res.success) throw Error("ERROR: getSites - " + res.error.message);
    let sites = res.data;
    if (siteName)
      sites = {
        ...sites,
        value: sites.value.filter((site) => site.name === siteName),
      };
    return sites;
  }
  // ...
```
