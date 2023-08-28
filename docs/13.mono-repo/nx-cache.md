---
title: "Nx Cache"
tags: [nodejs, lerna, mono-repo, nx]
---

# Adopt Nx Cache to speed up the build

## What is Nx Cache

One of the pain point of monorepo is that the build time is slow. Luckily, Nx provides a cache mechanism to speed up the build for Lerna monorepo.

## How to adopt Nx Cache

Use `lerna add-caching` command which will scan the workspace and find all the scripts in the package.json.
Then we will be asked a couple of questions to determine which scripts are cacheable and which scripts need to be run in deterministic/topoglogical order.

In this article, we will use the [Notifi SDK](https://github.com/notifi-network/notifi-sdk-ts) mono-repo as an example.

```bash
➜  notifi-sdk-ts git:(main) ✗ npx lerna add-caching
lerna notice cli v5.6.2
lerna info add-caching Please answer the following questions about the scripts found in your workspace in order to generate task runner configuration

? Which of the following scripts need to be run in deterministic/topoglogical order?

? Which of the following scripts are cacheable? (Produce the same output given the same input, e.g. build, test and lint usually are, serve and start are not)


lerna success add-caching Successfully updated task runner configuration in `nx.json`
lerna info add-caching Learn more about task runner configuration here: https://lerna.js.org/docs/concepts/task-pipeline-configuration
lerna info add-caching Note that the legacy task runner options of --sort, --no-sort and --parallel no longer apply. Learn more here: https://lerna.js.org/docs/recipes/using-lerna-powered-by-nx-to-run-tasks
```

We will see a new `nx.json` config file is auto generated

```json title="nx.json"
{
  "tasksRunnerOptions": {
    "default": {
      "runner": "nx/tasks-runners/default",
      "options": {
        "cacheableOperations": ["build"]
      }
    }
  },
  "targetDefaults": {}
}
```

## Try to build the project

We can run build for the first time w/o cache as below:

```bash
➜  notifi-sdk-ts git:(main) ✗ npx lerna run build --scope=@notifi-network/notifi-react-card
lerna notice cli v5.6.2
lerna notice filter including "@notifi-network/notifi-react-card"
lerna info filter [ '@notifi-network/notifi-react-card' ]

> @notifi-network/notifi-react-card:build

> @notifi-network/notifi-react-card@0.81.0 build
> npm run clean && npm run compile
> @notifi-network/notifi-react-card@0.81.0 clean
> rimraf ./dist
> @notifi-network/notifi-react-card@0.81.0 compile
> tsup lib/index.ts --sourcemap --format cjs,esm --dts --clean --external react
CLI Building entry: lib/index.ts
CLI Using tsconfig: tsconfig.json
CLI tsup v6.6.3
CLI Using tsup config: /Users/macbookpro4eric/Projects/notifi/notifi-sdk-ts/packages/notifi-react-card/package.json
CLI Target: es2017
CLI Cleaning output folder
CJS Build start
ESM Build start
ESM dist/index.css     35.91 KB
ESM dist/index.mjs     471.18 KB
ESM dist/index.css.map 45.39 KB
ESM dist/index.mjs.map 829.47 KB
ESM ⚡️ Build success in 366ms
CJS dist/index.css     35.91 KB
CJS dist/index.js      493.47 KB
CJS dist/index.css.map 45.39 KB
CJS dist/index.js.map  828.70 KB
CJS ⚡️ Build success in 368ms
DTS Build start
DTS ⚡️ Build success in 9220ms
DTS dist/index.d.ts 78.96 KB

 ———————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————

 >  Lerna (powered by Nx)   Successfully ran target build for project @notifi-network/notifi-react-card (12s)
```

We can see the build time is 12s. Nx here already caches the build result.

Then we can run the build again with cache:

```bash
➜  notifi-sdk-ts git:(eric/MVP-3179) ✗ npx lerna run build --scope=@notifi-network/notifi-react-card
lerna notice cli v5.6.2
lerna notice filter including "@notifi-network/notifi-react-card"
lerna info filter [ '@notifi-network/notifi-react-card' ]

> @notifi-network/notifi-react-card:build  [local cache]


> @notifi-network/notifi-react-card@0.81.0 build
> npm run clean && npm run compile


> @notifi-network/notifi-react-card@0.81.0 clean
> rimraf ./dist


> @notifi-network/notifi-react-card@0.81.0 compile
> tsup lib/index.ts --sourcemap --format cjs,esm --dts --clean --external react

CLI Building entry: lib/index.ts
CLI Using tsconfig: tsconfig.json
CLI tsup v6.6.3
CLI Using tsup config: /Users/macbookpro4eric/Projects/notifi/notifi-sdk-ts/packages/notifi-react-card/package.json
CLI Target: es2017
CLI Cleaning output folder
CJS Build start
ESM Build start
CJS dist/index.js      493.47 KB
CJS dist/index.css     35.91 KB
CJS dist/index.css.map 45.39 KB
CJS dist/index.js.map  828.70 KB
CJS ⚡️ Build success in 393ms
ESM dist/index.css     35.91 KB
ESM dist/index.mjs     471.18 KB
ESM dist/index.css.map 45.39 KB
ESM dist/index.mjs.map 829.47 KB
ESM ⚡️ Build success in 395ms
DTS Build start
DTS ⚡️ Build success in 9629ms
DTS dist/index.d.ts 78.96 KB

 ———————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————

 >  Lerna (powered by Nx)   Successfully ran target build for project @notifi-network/notifi-react-card (81ms)

   Nx read the output from the cache instead of running the command for 1 out of 1 tasks.
```

We can see the build time is 81ms. Nx here reads the output from the cache instead of running the command.

:::caution

You might come across the following error if macOS is used.

```bash
➜  notifi-sdk-ts git:(eric/MVP-3179) ✗ npx lerna run build --scope=@notifi-network/notifi-react-card
lerna notice cli v5.6.2
lerna notice filter including "@notifi-network/notifi-react-card"
lerna info filter [ '@notifi-network/notifi-react-card' ]

 >  Lerna (powered by Nx)   Cannot find module '@nrwl/nx-darwin-x64'
```

For this case, we can just run `npm install @nrwl/nx-darwin-x64` to fix it.

:::

# Reference

- https://www.youtube.com/shorts/VhobZG_4AU8

```

```
