---
title: "Axios Http Request"
tags: [nodejs, axios, http, line-notify]
---

Some of you might be like me, often forget the field definition of the request body and the corresponding args in the axios api.

Most of the time, use use "POST" to send a request to api server with `request body` and `request header`.
The authorization header is also required in most of the cases.

Axios is a very popular http request library in nodejs. It is easy to use and has a lot of features.

Before getting into axios usage. we need to know more about the detail about the basic of http protocol

So when we want to ask a server to do something for us, we need to send a request to the server. And nowadays the most common way to send request is using http protocol.

Then after the server received the request, it will do the work and send back the response to us.

In this article, we will focus on how to send a request to the server.

## Http Request

### Request Line

The first line of an HTTP request is called the request line. It contains three fields: the request method, the URI, and the HTTP version.

```http
GET / HTTP/1.1
```

The most important part is the `method`, there are several methods in http protocol, the most common ones are `GET`, `POST`, `PUT`, `DELETE`.

### Request Header

Header just a key-value pair, it contains some information about the request. You can get more information about the header [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages#headers).

What we often need to customized in the header is the `Authorization` header. It is used to tell the server who you are. It is often used with the `Bearer` token.

If coming across the `CORS` issue, you might need to manipulate the `Origin` header to tell the server where you are from.

### Request Body

It is the final part of the request. It is used to send some data to the server. It is often used in the `POST` request.
Not all requests have one: requests fetching resources, like GET, HEAD, DELETE, or OPTIONS, usually don't need one

## Axios

with the basic knowledge of http request, we can start to use axios to send a request.

### POST

We will use a real word example to show how to use axios to send a request to the server. in this case, we are using the [Line notify](https://notify-bot.line.me/en/) api to send a message to the line group.

#### Create a line notify token for certain group

1. login to [line notify](https://notify-bot.line.me/my/) with your line account

2. Click top-right corner your account profile name and select `my page`

3. Select the group you want to create a token for and click `Create Token`

4. Test the token by sending a message to the group using Postman

- Method: POST
- URL: https://notify-api.line.me/api/notify
- Headers:
  - Authorization: Bearer {token}
- Params:
  - message: "Hello this is a test message"

Now we can see the post request detail above, the http request should look like this:

#### Compose Http header and body

```http
// Header below
POST /api/notify HTTP/1.1
Host: notify-api.line.me
Authorization: Bearer {token}
// other headers
// ...

// Body below
message=Hello%20this%20is%20a%20test%20message
```

### Understand the interface of axios post method and compose the request

To use `axios.post`, we need to firstly understand how to pass in the current info into the function.

```ts
post(
  url: string,
  data?: any,
  config?: AxiosRequestConfig<any> | undefined
): Promise<AxiosResponse<any, any>>
```

from the above function definition, we can see that the `axios.post` function has three arguments.

1. endpoints: the url of the api
2. [formData](https://developer.mozilla.org/en-US/docs/web/api/formdata): the data we want to send to the server
3. [config](https://github.com/axios/axios/blob/v1.x/index.d.ts#L306): a AxiosRequestConfig object which contains the `header` and `body` parts of the request

The third argument is the most important one which contains the `header` and `body` parts.

You can check out the official [code base](https://github.com/axios/axios/blob/v1.x/index.d.ts#L306) for the detail of the `AxiosRequestConfig` object.
You will realize that the params argument is in optional `any` type which is not very helpful.

Basically, the params can contains our body with any key-pair value.

With this knowledge, we can start sending the post request to line server and send a message to the line group.

```ts
const endpoint = "https://notify-api.line.me/api/notify";
const notifyGroupToken = "your-line-notify-group-specific-token";
axios
  .post(
    endpoint,
    // we dont have formData in this case, so we can just pass in an empty object
    {},
    // the config object with header and body content
    {
      headers: {
        Authorization: `Bearer ${notifyGroupToken}`,
      },
      params: {
        message: `Hello world`,
      },
    }
  )
  .then((res) => {
    console.log(res);
  })
  .catch((e) => {
    console.log(e);
  })
  .finally(() => {
    console.log("done");
  });
```

### GET

Coming soon... 🛠️

### DELETE

Coming soon... 🛠️

### PUT

Coming soon... 🛠️
