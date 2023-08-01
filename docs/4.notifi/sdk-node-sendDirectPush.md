---
title: Notifi SDK `notifi-node`-sendDirectPush
---

# Notifi SDK `notifi-node` - sendDirectPush

`notifi-node` is a server-side SDK which can be used to manage notifi tenant.

In this article, we are going to create a simple example to showcase how to use the `notifi-node` SDK to initialize notifi service object by which we are able to send out direct message to the user.

## Prerequisites

Install the following Dependencies:

```json
"dependencies": {
    "@notifi-network/notifi-node": "^0.76.0",
    "express": "^4.17.3",
    "morgan": "^1.10.0",
    "morgan-json": "^1.1.0"
  },
"devDependencies": {
    "@types/express": "^4.17.13",
    "@types/morgan": "^1.9.3",
    "@types/morgan-json": "^1.1.0",
    "@types/node": "^17.0.21",
    "nodemon": "^2.0.15",
    "ts-node": "^10.7.0"
  },
```

Then create a script to run the server.

```json
"scripts": {
    "dev": "nodemon lib/index.ts"
  },
```

## Create a simple express server

Create a `index.ts` file with the following code by which we can send a GET request to trigger a `cleint.sendDirectMessage` [^1].

[^1]: You need to have a tenant created in notifi [AP](https://admin.dev.notifi.network/) to have the dapp credentials.

```ts
import {
  NotifiClient,
  NotifiEnvironment,
  createGraphQLClient,
  createNotifiService,
} from "@notifi-network/notifi-node";
import type { NextFunction, Request, Response } from "express";
import express from "express";
import morgan from "morgan";
import json from "morgan-json";

const app = express();

app.use(express.json());
app.use(express.urlencoded());

const format = json({
  short: ":method :url :status",
  length: ":res[content-length]",
  "response-time": ":response-time ms",
});

app.use(morgan(format));

const port = process.env.PORT || "8080";

app.get("/", (_req, res) => {
  return res.status(200).json({
    hello: "world",
  });
});

const notifiServiceMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const graphqlClient = createGraphQLClient("Production" as NotifiEnvironment); // NotifiEnvironment object ("Production" | "Staging" | "Development" | "Local")
  const notifiService = createNotifiService(graphqlClient);
  res.locals.notifiService = notifiService;
  next();
};

app.use(notifiServiceMiddleware);

app.get("/send-push", (req, res) => {
  const sid = "NPOFGOF0Z3P0NLVPXDVA111PVYV16KIG"; // SID to change

  const secret =
    "vV$)RuHwJ6D3&7@w$y2-U6?oE4%VzVYpnCVPp9gGtKp~NBe^PB99SsDZR2naU+2>"; // Secret to change

  const client = new NotifiClient(res.locals.notifiService);
  client.logIn({ sid, secret }).then(({ token, expiry }) => {
    client
      .sendDirectPush(token, {
        key: `${Math.round(Math.random() * 1e10)}`, // Unique key for this push
        walletPublicKey: "5UNsPiZPHCSvLWkbVDZrakfn1DsW1e2qPh8QvW6zbqjJ", // Wallet address to push to
        walletBlockchain: "SOLANA",
        message: "Message to user",
        type: "erictestnotifi__directpush", // Direct push ID to change
      })
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch((err) => {
        return res.status(500).json(err);
      });
  });
});

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
```

After running `npm run dev`, we can send a GET request to `http://localhost:8080/send-push` to trigger the `client.sendDirectMessage` method.

Then we will be able to see the following result in the console.

```bash
{
  input: {
    walletPublicKey: '5UNsPiZPHCSvLWkbVDZrakfn1DsW1e2qPh8QvW6zbqjJ',
    walletBlockchain: 'SOLANA',
    messageKey: '2820690784',
    messageType: 'DIRECT_TENANT_MESSAGE',
    message: '{"message":"Message to user","type":"erictestnotifi__directpush"}'
  }
}
{
  variables: {
    input: {
      walletPublicKey: '5UNsPiZPHCSvLWkbVDZrakfn1DsW1e2qPh8QvW6zbqjJ',
      walletBlockchain: 'SOLANA',
      messageKey: '2820690784',
      messageType: 'DIRECT_TENANT_MESSAGE',
      message: '{"message":"Message to user","type":"erictestnotifi__directpush"}'
    }
  },
  headers: {
    'X-Request-Id': '9bb8803b-9879-4321-afc0-218c239ee499',
    Authorization: 'Bearer eyJh...eSHiBg'
  }
}
```

Under the hood, the SDK call the notifi [graphql API](https://api.notifi.network/gql/) to send out the direct message.

We can also use the playground to test the API with the following query.

```gql title="query"
mutation sendMessage($input: SendMessageInput!) {
  sendMessage(sendMessageInput: $input)
}
```

```json title="variables"
{
  "input": {
    "walletPublicKey": "5UNsPiZPHCSvLWkbVDZrakfn1DsW1e2qPh8QvW6zbqjJ",
    "walletBlockchain": "SOLANA",
    "messageKey": "abcdefgdxd",
    "messageType": "DIRECT_TENANT_MESSAGE",
    "message": "{\"message\":\"This is a test\",\"type\":\"erictestnotifi__directpush\"}"
  }
}
```

```json title="Headers"
Authorization: 'Bearer eyJh...eSHiBg'
```

![](/img/notifi/docs-notifi-node-sendDirectPush.png)
