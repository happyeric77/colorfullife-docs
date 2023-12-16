---
title: notifi node
---

[@notifi-network/notifi-node](https://www.npmjs.com/package/@notifi-network/notifi-node) npm package allows developers to integrate Notifi service into their nodejs backend.

Developers can use this package to:

1. Connect to notifi backend as Tenant admin using credentials (sid & secret)
2. Broadcast or direct message to dapp users
3. other tenant mangement operations

We will use the [notifi-node-sample](https://www.npmjs.com/package/@notifi-network/notifi-node) to demonstrate #1 & #2 above.

## Prerequisite

1. clone the notifi sdk github repo and install the dependencies

```bash
git clone https://github.com/notifi-network/notifi-sdk-ts.git
cd notifi-sdk-ts
npm install
```

2. run the notifi-sample-node

```bash
npx lerna --scope=@notifi-network/notifi-node-sample run dev
```

Now the node server is running on port 3000.

## Connect to notifi backend as Tenant admin

Go to [notifi admin portal](https://admin.dev.notifi.network/settings) to create a tenant and get the tenant credentials (sid & secret).

Then we can HTTP POST the credentials to the node server to get the tenant admin JWT to do operations.

Open postman and send the following request to the node server.

- endpoint: http://localhost:8080/login
- body

```json
{
  "sid": "NPOFGOF0Z3P0NLVPXDVA111PVYV16KIG",
  "secret": "vV$)RuHwJ6D3&7@w$y2-U6?oE4%VzVYpnCVPp9gGtKp~NBe^PB99SsDZR2naU+2>"
}
```

![](/img/notifi/docs-notifi-node-example.png)

Then we can use the JWT token as the authorization header (Bearer) to do tenant admin operations. for example, sending broadcast message to all users.

## Broadcast or direct message to dapp users

Now we take the JWT token above and send a broadcast message to all users by HTTP POST below body to the node server.

- endpoint: http://localhost:8080/broadcastMessage
- header

- body

```json
{
  "topicName": "erictestnotifi__announcements",
  "message": "Message",
  "subject": "subject"
}
```

![](/img/notifi/docs-notifi-node-broadcast.png)

If we want to broadcast to only certain desination, we can change the code `packages/notifi-node-sample/lib/index.ts`.

```ts
app.post("/broadcastMessage", authorizeMiddleware, (req, res) => {
  // ...
  return client.sendBroadcastMessage(jwt, {
    topicName,
    // For sending email, we need to set the targetTemplates
    // targetTemplates: [{ key: 'EMAIL', value: '' }],
    // For sending telegram, we need to set the targetTemplates
    targetTemplates: [{ key: "TELEGRAM", value: "" }],
    variables: [
      {
        key: "message",
        value: message,
      },
      {
        key: "subject",
        value: subject,
      },
    ],
  });
  // ...
});
```

:::tip
Notifi backend also takes markdown format, so we can also input markdown format in the message. here is an example.

```json
{
  "topicName": "erictestnotifi__announcements",
  "message": "Message [hyperlink](https://google.com)",
  "subject": "subject"
}
```

:::

## Reference

- [Notifi custom template Doc](https://notifi-network.github.io/docs/alert-design/custom-email-templates)
