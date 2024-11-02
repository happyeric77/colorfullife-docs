---
title: TypeScript documentation for mono-repo
tags: [typescript, typedoc]
---

In a mono-repo, you can generate TypeScript documentation for all packages using TypeDoc. This guide will show you how to generate documentation for a mono-repo with multiple packages.

## Prerequisites

A mono-repo with multiple TypeScript packages

:::info

We will use Lerna monorepo in this guide as an example.

:::

## Steps to generate type documentation

1. Install TypeDoc as a dev dependency in the root of the mono-repo:

```bash
npm install --save-dev typedoc
```

2. Create configuration file `typedoc.json` for the packages

```json title="packages/package-1/typedoc.json"
{
  "entryPoints": ["src/index.ts"],
  "out": "docs/package-1",
  "tsconfig": "./tsconfig.json"
}
```

```json title="packages/package-2/typedoc.json"
{
  "entryPoints": ["src/index.ts"],
  "out": "docs",
  "tsconfig": "./tsconfig.json"
}
```

:::tip

- `entryPoints`: The entry point of the package
- `out`: The output directory for the documentation
- `tsconfig`: The path to the `tsconfig.json` file

:::

3. Add a script to the root `package.json` to generate documentation for all packages:

Firstly, we need to create a `docs` folder in the root of the mono-repo.

Then modify the `package.json` file to include the following scripts:

```json title="package.json"
{
  "scripts": {
    "docs": " yarn build-docs && cp -r packages/package-1/docs/package-1 packages/package-2/docs/package-2 docs",
    "build-docs": " yarn build-docs:package-1 &&  yarn build-docs:package-2",
    "build-docs:package-1": " typedoc --skipErrorChecking --options packages/package-1/typedoc.json",
    "build-docs:package-2": " typedoc --skipErrorChecking --options packages/package-2/typedoc.json"
  }
}
```

4. Run the following command to generate the documentation:

```bash
npm run docs
```

:::tip

- build-docs:pacakge-1: Generate documentation for package-1 under `packages/package-1/docs/package-1`

- build-docs:pacakge-2: Generate documentation for package-2 under `packages/package-2/docs/package-2`

- docs: Copy the generated documentation to the `docs` folder in the root of the mono-repo

:::

## Preview the Typedoc page

We will utilize the `light-server` package to preview the generated documentation.

1. Install `light-server` as a dev dependency:

```bash
npm install --save-dev light-server
```

2. Add a script to the root `package.json` to preview the documentation:

```json title="package.json"
{
  "scripts": {
    "serve-docs": "light-server -s ./docs -p 4000"
  }
}
```

Execute `npm run serve-docs` to establish a server at `http://localhost:4000` to preview the generated documentation like below:

![TypeDoc](https://i.imgur.com/prsAATg.png)

## Host the documentation on GitHub Pages

To host the documentation on GitHub Pages, follow these steps:

1. Login to the GitHub account which contains the mono-repo then select the `Settings` tab.

2. Click the `Pages` tab on the left sidebar.

3. Under the `Build and deploy` section,

   - Select `Deploy from a branch` as the source.
   - Choose the branch where the documentation is generated.
   - Select the folder where the documentation is located.

Then click `Save` to deploy the documentation. When we click the `Actions` tab, we can see the deployment status (also history) of the documentation. This also shows the URL where the documentation is hosted.

When we access the URL, we will see the page like below:

![GitHub Pages](https://i.imgur.com/mYfnKuH.png)

Oops! Looks like github pages requires a `index.html` file to be present in the root of the `docs` folder. We can fix this by adding a `index.html` file in the root of the `docs` folder.

You can put what ever content you want in the `index.html` file. Here is an example embedding a iframe of my `docusaurus` documentation as the root of the `docs` folder:

```html title="docs/index.html"
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Colorful Life</title>
    <style>
      body,
      html {
        margin: 0;
        padding: 0;
        height: 100%;
        overflow: hidden;
      }
      iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: none;
      }
    </style>
  </head>
  <body>
    <iframe
      src="https://docs.dev-eric.work/"
      width="100%"
      height="600px"
      frameborder="0"
    ></iframe>
  </body>
</html>
```

Then commit and push the changes to the repository. The documentation will be hosted on GitHub Pages.

:::info

[Github Source code](https://github.com/happyeric77/colorfullife/tree/typedoc)

:::
