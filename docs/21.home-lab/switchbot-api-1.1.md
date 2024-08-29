---
title: SwitchBot API 1.1
tags: [api, iot, home-assistant]
---

SwitchBot API 1.0 became not able to fetch the device status anymore from 2024/03/01. So, we need to use the SwitchBot API 1.1 to get the device status.

There is an example to use the SwitchBot API 1.1 to get all devices status.

```javascript
const crypto = require("crypto");
const getHeaders = (apiToken, secret) => {
  const nonce = Math.floor(Math.random() * 1000000); // Random Id
  const t = Date.now();
  const data = apiToken + t + nonce;
  const signTerm = crypto
    .createHmac("sha256", secret)
    .update(Buffer.from(data, "utf-8"))
    .digest();
  const sign = signTerm.toString("base64");
  return {
    t,
    nonce,
    sign,
  };
};

console.log(getHeaders("switchbot_api_token", "switchbot_secret")); // token and secret available in the SwitchBot Mobile APP
```

:::info

```javascript title="Output"

{
  t: 1719126716849,
  nonce: 397236,
  sign: 'zLmjQ8ymf8P9EvPx54SepO5HjABj+30FfBFgYSSRuNo='
}

```

:::

Then we can use the headers to make a request to the SwitchBot API 1.1 endpoint

1. Using curl

```bash title="Get all devices status"
curl -X GET "https://api.switch-bot.com/v1.1/devices" -H "Authorization: Bearer <your-api-token>" -H "Content-Type: application/json" -H "sign: <from-above-sign>" -H "t: <from-above-t>" -H "nonce: <from-above-nonce>"  | python3 -m json.tool
```

2. Using Node.js

```javascript
const execSync = require("child_process").execSync;
const crypto = require("crypto");
const getHeaders = (apiToken, secret) => {
  const nonce = Math.floor(Math.random() * 1000000); // Random Id
  const t = Date.now();
  const data = apiToken + t + nonce;
  const signTerm = crypto
    .createHmac("sha256", secret)
    .update(Buffer.from(data, "utf-8"))
    .digest();
  const sign = signTerm.toString("base64");
  return {
    t,
    nonce,
    sign,
  };
};

const apiToken = "you-api-token";
const secret = "your-secret";

const { t, nonce, sign } = getHeaders(apiToken, secret); // token and secret available in the SwitchBot Mobile APP
const script = `curl -X GET "https://api.switch-bot.com/v1.1/devices" -H "Authorization: Bearer ${apiToken}" -H "Content-Type: application/json" -H "sign: ${sign}" -H "t: ${t}" -H "nonce: ${nonce}" `;
console.log({ apiToken, secret });
const output = execSync(script, { encoding: "utf-8" });

console.log(output);
```
