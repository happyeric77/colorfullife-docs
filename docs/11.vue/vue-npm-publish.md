---
title: Publish Vue UI Lib
tags: [vite, vue, npm]
---

# Publish Vue Component library to NPM (Typescript)

In this article, we will learn how to publish a Vue component library to NPM. We will be using Typescript for this example.

We firstly demonstrate how to use the component library that we will be publishing. Then we will go through the steps to publish the library.

## Usage

In this example, we are going to create a simple vue bottom component (You can also try [here](https://www.npmjs.com/package/vue-card-dummy)) library that we can `npm install` from NPM and use in any other Vue project. We will name the library `vue-card-dummy`.

After installing the library by `npm install vue-card-dummy`, we can use the component in existing vue project:

```tsx title=src/main.ts
import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
// add-start
import DummyCard from "vue-card-dummy";
import "vue-card-dummy/dist/style.css";
// add-end

const app = createApp(App);

app.use(DummyCard);
app.mount("#app");
```

```tsx title=src/App.vue
<script setup lang="ts">
import { ref } from "vue";

const title = ref<string>("Below is the dummy card");
</script>

<template>
  <div class="title">{{ title }}</div>
  <br />
  <DummyCard> Vue dummy card </DummyCard>
</template>

<style scoped>
.title {
  color: green;
}
</style>
```

## Environment

We are using Vite + Vue 3 (Composition API) + Typescript for this example.

To init a Vue project with Vite, use the following command:

```bash
npm init vue@latest vue-card-dummy # Select the Typescript option
npm install
```

## Create the DummyCard component

Since we are going to only create a component library, we will not need all the scaffolding files that come with the vue project. We can delete the following files:

- `src/`
- `index.html`
- `public/`

Then we will create a new folder named `lib` to hold the component with two files:

The Project structure tree should look like this:

```bash
.
├── env.d.ts
# highlight-start
├── lib
│   ├── components
│   └── index.ts
# highlight-end
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

We will create a simple dummy card component that we can be used in other Vue projects.

```tsx title=lib/components/DummyCard.vue
<template>
  <div class="card">
    <slot />
  </div>
</template>

<style scoped>
.card {
  margin-bottom: 1.5rem;
  border-radius: 0.25rem;
  box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1);
  border: 1px solid #dbdbdb;
  color: orange;
}
</style>

```

And we also need a `index.ts` file to export the component.

```ts title=lib/index.ts
import DummyCard from "./components/DummyCard.vue";

export default {
  install: (app) => {
    app.component("DummyCard", DummyCard);
  },
};
```

## Set up package.json and vite.config.ts

To export a vue component library with vite, the certain format of config is needed.
It is called `Library Mode` in vite. Checkout the [documentation](https://vitejs.dev/guide/build.html#library-mode) for more details.

So, we will need to add few lines in `vite.config.ts`:

```ts title=vite.config.ts
// add-next-line
import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  // add-start
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "lib/index.ts"),
      name: "vue-card-dummy",
      // the proper extensions will be added
      fileName: "vue-card-dummy",
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["vue"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: "Vue",
        },
      },
    },
  },
  // add-end
  plugins: [vue()],
});
```

And then we need to build the library by the `rollup` bundler which is already included in vite. This is the reason we need to add the `rollupOptions` in the `vite.config.ts` like above.

```bash
npm run build-only # or vite build

```

<details>
<summary>Output</summary>

```bash
➜  vue-card-dummy npm run build-only

> vue-card-dummy@0.0.0 build-only
> vite build

vite v4.3.9 building for production...
✓ 4 modules transformed.
dist/style.css           0.14 kB │ gzip: 0.13 kB
dist/vue-card-dummy.mjs  0.49 kB │ gzip: 0.35 kB
dist/vue-card-dummy.umd.js  0.58 kB │ gzip: 0.40 kB
✓ built in 369ms
```

</details>

Finally, we can properly config our `package.json` file to have it ready to publish

```json
{
  "name": "vue-card-dummy",
  "version": "0.0.0",
  // add-start
  "exports": {
    ".": {
      "import": "./dist/vue-card-dummy.mjs",
      "require": "./dist/vue-card-dummy.umd.js"
    },
    "./dist/style.css": "./dist/style.css"
  },
  // add-end
  "scripts": {
    "dev": "vite",
    "build": "run-p type-check build-only",
    "preview": "vite preview",
    "build-only": "vite build",
    "type-check": "vue-tsc --noEmit -p tsconfig.app.json --composite false"
  },
  "files": ["dist"],
  "dependencies": {
    "vue": "^3.3.4"
  },
  "devDependencies": {
    "@tsconfig/node18": "^2.0.1",
    "@types/node": "^18.16.17",
    "@vitejs/plugin-vue": "^4.2.3",
    "@vue/tsconfig": "^0.4.0",
    "npm-run-all": "^4.1.5",
    "typescript": "~5.0.4",
    "vite": "^4.3.9",
    "vue-tsc": "^1.6.5"
  }
}
```

That's it, it is ready to publish to npm.
Wait ....... we might need to test it before publishing.

## Test the library

To test the library, we will make use of the `npm link` command. It will create a symlink in the global folder of npm, so that we can use it in other projects.

We first need to run the `npm link` command in the library project:

```bash title=vue-card-dummy
npm link
```

<details>
<summary>Output</summary>

```bash
➜  vue-card-dummy npm link

up to date, audited 3 packages in 963ms

found 0 vulnerabilities
```

</details>

Then we can go to the project that we want to test the library and run the following command:

```bash
npm link vue-card-dummy
```

<details>
<summary>Output</summary>

```bash
➜  vue-card-consumer npm link vue-card-dummy

up to date, audited 202 packages in 3s

56 packages are looking for funding
  run `npm fund` for details

8 moderate severity vulnerabilities

To address issues that do not require attention, run:
  npm audit fix

To address all issues (including breaking changes), run:
  npm audit fix --force

Run `npm audit` for details.
```

</details>

:::info

- [Github Repo](https://github.com/happyeric77/colorfullife/tree/master/packages/vue-card-dummy)
- [NPM package](https://www.npmjs.com/package/vue-card-dummy)

## References

- [walletconnect-vue example](https://github.com/AxyLm/web3modal-vue?ref=vuejsexamples.com)
