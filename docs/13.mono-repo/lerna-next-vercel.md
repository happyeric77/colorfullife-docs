---
title: "Deploy Nextjs project with Lerna and Vercel"
tags: [nextjs, lerna, mono-repo]
---

Vercel is a cloud platform for static sites and Serverless Functions which is the best place to deploy Next.js applications as vercel is optimized for Next.js (vercel is also the creator of Next.js).

In this article, we will deploy a Next.js managed by Lerna mono-repo to Vercel. It is a bit tricky since Vercel will auto-detect the project and as our root is not Next.js but Lerna, Vercel will auto-select `Other` as the setup project. Some configurations are needed in this case:

## Build command

As we are on on the root of `.lerna`, we need to specify the build command pointing to the Next.js project.

In case the project has the following package.json:

```json title="packages/example-package/package.json"
{
  "name": "example-package",
  // ...
  "scripts": {
    "build:next": "next build"
    // ...
  }
  // ...
}
```

We will need to specify the build command as below:

```bash

npx lerna --scope=example-package run build:next

```

## Output directory

The output directory is the directory where the build command will output the files. In the case of Next.js, it is the `.next` directory.

```bash

packages/example-package/.next

```

## Install command

There is the place requires a bit of trick. We need to `build` the whole mono-repo before start building the Next.js project. Otherwise, the Next.js project will not be able to find the dependencies.

So `npm run build` is required after `npm install`

If we have the following `package.json` in the root of the project:

```json title="package.json"
{
  "name": "example-lerna-project",
  // ...
  "scripts": {
    "build": "npx lerna run build"
    // ...
  }
  // ...
}
```

We will need to specify the `install command` section as below:

```bash

npm install && npm run build

```

## The real-world example

We deployed [notifi-react-example-v2](https://github.com/notifi-network/notifi-sdk-ts/tree/stage-notifi-react-m2/packages/notifi-react-example-v2) project managed by Lerna mono-repo to Vercel. The result is [here](https://notifi-sdk-ts-vercel-notifi-react-example-v2.vercel.app/)

Our config is like this:

![vercel-config](https://i.imgur.com/9Bc87Pi.png)
