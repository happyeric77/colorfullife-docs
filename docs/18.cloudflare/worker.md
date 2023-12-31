---
title: Cloudflare worker
tags: [cloudflare, worker]
---

Cloudflare worker is a serverless platform that allows you to run javascript code on the edge of the cloudflare network.

This function is very useful when you want to do some preprocessing before the request is sent to the origin server.

We will introduce a problem which can be solved by cloudflare worker.

## Problem to solve

I am using `cloudApp` to share the files and images with my coworkers. However, the url of the shared files is not the image content itself, but a html page with the image embedded. This makes it hard to embed the image in the markdown document.

## Solution

We can use cloudflare worker as a middlewear between browser and cloudApp server.
We can create a worker that fetches the shared link. Then the worker will parse the returned html page and extract the image url. Finally, the worker will fetch the image and return it to the browser.

## Implementation

There are two ways to implement the worker.

1. Use the cloudflare dashboard and online editor
2. Use the wrangler cli

In this article, we will adopt the second approach.

To get start with wrangler, you can check out the [official document](https://developers.cloudflare.com/workers/get-started/guide/#1-create-a-new-worker-project)

### Create a new project

```bash
npm create cloudflare@latest
```

<details>
<summary>Click to see the output</summary>

```bash
❯ npm create cloudflare@latest
Need to install the following packages:
create-cloudflare@2.8.4
Ok to proceed? (y) y

using create-cloudflare version 2.8.4

╭ Create an application with Cloudflare Step 1 of 3
│
├ In which directory do you want to create your application?
│ dir ./hello-worker
│
├ What type of application do you want to create?
│ type "Hello World" Worker
│
├ Do you want to use TypeScript?
│ yes typescript
│
├ Copying files from "hello-world" template
│
├ Retrieving current workerd compatibility date
│ compatibility date 2023-12-18
│
╰ Application created

╭ Installing dependencies Step 2 of 3
│
├ Installing dependencies
│ installed via `npm install`
│
├ Installing @cloudflare/workers-types
│ installed via npm
│
├ Adding latest types to `tsconfig.json`
│ added @cloudflare/workers-types/2023-07-01
│
╰ Dependencies Installed

╭ Deploy with Cloudflare Step 3 of 3
│
├ Do you want to deploy your application?
│ yes deploy via `npm run deploy`
│
├ Logging into Cloudflare checking authentication status
│ not logged in
│
├ Logging into Cloudflare This will open a browser window
│ allowed via `wrangler login`
│
├ Selecting Cloudflare account retrieving accounts
│ account Myaccount@gmail.com's Account
│
├ Deploying your application
│ deployed via `npm run deploy`
│
├  SUCCESS  View your deployed application at https://hello-worker.myaccount.workers.dev
│
│ Navigate to the new directory cd hello-worker
│ Run the development server npm run start
│ Deploy your application npm run deploy
│ Read the documentation https://developers.cloudflare.com/workers
│ Stuck? Join us at https://discord.gg/cloudflaredev
│
├ Waiting for DNS to propagate
│ DNS propagation complete.
│
├ Waiting for deployment to become available
│ deployment is ready at: https://hello-worker.myaccount.workers.dev
│
├ Opening browser
│
╰ See you again soon!
```

</details>

Now we created a new worker project named `hello-worker`. and we can access it through pre-defined route `https://hello-worker.myaccount.workers.dev`.

### Modify the worker code

The `hello-worker` is just a dummy project that returns a `Hello World` string. We will modify the code to fetch the shared link and return the image content.

```ts
export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    // get the url from the request
    const url = request.url.split("??")[1];
    if (!url)
      return new Response(
        "No url provided. ex. ??https://<cloudApp-image-item-share-link>",
        { status: 400 }
      );
    const htmlText = await (await fetch(url)).text();
    // get the image content url from the html
    const img = htmlText
      .split("\n")
      .find((line) => line.includes("og:image"))
      ?.split('content="')[1]
      .split('"')[0];

    // return the image
    return fetch(img!);
  },
};
```

### Use dev server

Let's have a look at the `package.json` file. we have 3 scripts defined, but there are actually two because `dev` and `start` are the same.

```json
{
  "scripts": {
    "deploy": "wrangler deploy",
    "dev": "wrangler dev",
    "start": "wrangler dev"
  }
}
```

We can use the dev server to test the worker locally.

```bash
npm run dev
```

<details>
<summary>Click to see the output</summary>

```bash
❯ npm run dev

> cloudapp-img-resolver@0.0.0 dev
> wrangler dev

 ⛅️ wrangler 3.22.1
-------------------
⎔ Starting local server...
[wrangler:inf] Ready on http://localhost:8787
╭──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ [b] open a browser, [d] open Devtools, [l] turn off local mode, [c] clear console, [x] to exit                                           │
╰──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯

```

</details>

Then we can access the worker with the following url format:

```
http://localhost:8787/??https://share.zight.com/4guWAkYD
```

> The `??` is a special syntax defined by the worker. It is used to separate the worker url and the url of the shared link.

### Deploy the worker

After finishing development, we can deploy the worker by running `npm run deploy`.

<details>
<summary>Click to see the output</summary>

```bash
❯ npm run deploy

> hello-worker@0.0.0 deploy
> wrangler deploy

 ⛅️ wrangler 3.22.1
-------------------
Total Upload: 0.50 KiB / gzip: 0.34 KiB
Uploaded hello-worker (0.84 sec)
Published hello-worker (0.36 sec)
  https://hello-worker.myaccount.workers.dev
Current Deployment ID: my-deployment-id
```

</details>

Then we can access the worker with the following url format:

```
https://hello-worker.myaccount.workers.dev/??https://share.zight.com/4guWAkYD
```

## Rename project: hello-worker -> cloudapp-img-resolver

1. Rename the project folder (optional)

2. Rename the project name in `wrangler.toml`

   ```toml
   name = "cloudapp-img-resolver"
   ```

3. Rename the project name in `package.json`

   ```json
   {
     "name": "cloudapp-img-resolver"
   }
   ```

4. Rename the project name in cloudflare dashboard

   ![](https://cloudapp-img-resolver.dev-eric.work??https://share.zight.com/QwuXxPe6)

## Add custom domain for the worker

If you also have a domain managed by cloudflare, you can add a subdomain for the worker.

![](https://cloudapp-img-resolver.dev-eric.work??https://share.zight.com/RBuk6o7g)

Then you can access the worker with the following url format:

```
https://example.my-domain-name.com/??https://share.zight.com/4guWAkYD
```

:::tip
Source code: [https://github.com/happyeric77/cloudflare-worker](https://github.com/happyeric77/cloudflare-worker)
:::
