---
title: Webpack - ModuleScopePlugin
tags: [webpack, react, bundler]
---

# ModuleScopePlugin

## What is ModuleScopePlugin

`ModuleScopePlugin` is a webpack plugin that limits the module search scope to a specific directory. It is used in `create-react-app` to prevent the app from importing modules outside of `src/` directory.

As can be seen from the source code of `react-scripts`, the plugin is used in the webpack config file `config/webpack.config.js`, it mentions that the plugin is used to prevent users from importing files from outside of `src/` or `node_modules/`.

The reason why `node_modules` is also available is that when we import the modules from `node_modules`, the module-resolution will kick. A simple example is that we can import `react` from `node_modules` without specifying the path.

```js
// ...
plugins: [
  // Prevents users from importing files from outside of src/ (or node_modules/).
  // This often causes confusion because we only process files within src/ with babel.
  // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
  // please link the files into your node_modules/ and let module-resolution kick in.
  // Make sure your source files are compiled, as they will not be processed in any way.
  new ModuleScopePlugin(paths.appSrc, [
    paths.appPackageJson,
    reactRefreshRuntimeEntry,
    reactRefreshWebpackPluginRuntimeEntry,
    babelRuntimeEntry,
    babelRuntimeEntryHelpers,
    babelRuntimeRegenerator,
    // require.resolve('css-loader'),
  ]),
],
// ...
```

## Problem

In some cases, we may want to import modules from outside of `src/` directory. For example, we have a `node_modules.nosync` directory that contains the needed modules. And we create a symbolic link `node_modules` to the `node_modules.nosync` directory.

:::info

The detail of the use case is described in [this repo](https://github.com/happyeric77/colorfullife/tree/master/packages/icloud-nosync)

:::

When we run `npm start` to start the app, we will see the following error:

```bash

Failed to compile.

Module not found: Error: You attempted to import ../../../node_modules.nosync/css-loader/dist/runtime/sourceMaps.js which falls outside of the project src/ directory. Relative imports outside of src/ are not supported.
You can either move it inside src/, or add a symlink to it from project's node_modules/.

```

So, The cause is obvious. The `css-loader` is imported from `node_modules.nosync` directory, which is outside of the `src/` directory. And the `ModuleScopePlugin` prevents us from importing modules outside of `src/` directory.

This issue happens if the "create-react-app" is used to build up your project, because the plugin is adopt in the webpack config in `react-scripts`.

## Solution

Because "create-react-app" does not allow us to manipulate the webpack config without ejecting the app, and we do not want to eject.

So, we can make use of some 3rd party packages to help us to override the webpack config without ejecting the app.

Two options are available:

- [react-app-rewired](https://www.npmjs.com/package/react-app-rewired)
- [craco](https://www.npmjs.com/package/@craco/craco)

We will make example with `react-app-rewired` in this section.

After installing the package, we need to create a `config-overrides.js` file in the root directory of the project.

```js title="config-overrides.js"
const webpack = require("webpack");

module.exports = function override(config, env) {
  // ...
  config.resolve.plugins = config.resolve.plugins.filter(
    (plugin) => !(plugin instanceof ModuleScopePlugin)
  );
  // ...
  return config;
};
```

This removes the `ModuleScopePlugin` from the webpack config. Then the `npm run build` can be successfully executed. 🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉

**BUT**
☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️
☣️☣️☣️☣️☣️☣️☣️☣️☣️☣️☣️☣️☣️☣️☣️
⛔️⛔️⛔️⛔️⛔️⛔️⛔️⛔️⛔️

:::caution

Removing the `ModuleScopePlugin` is not a good practice, because this loses some protection.

:::

## Refactored Solution

We can print out the `ModuleScopePlugin` to see what it is by adding the following line in config file.

```js
console.log(
  config.resolve.plugins.filter(
    (plugin) => !(plugin instanceof ModuleScopePlugin)
  )
);
```

Then we will see the following output:

```ts
ModuleScopePlugin {
  appSrcs: [
    '/path-to-npm-project/notifi-sdk-ts/packages/notifi-react-example/src'
  ],
  allowedFiles: Set(6) {
    '/path-to-npm-project/notifi-sdk-ts/packages/notifi-react-example/package.json',
    '/path-to-npm-project/notifi-sdk-ts/node_modules.nosync/react-scripts/node_modules/react-refresh/runtime.js',
    '/path-to-npm-project/notifi-sdk-ts/node_modules.nosync/react-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/index.js',
    '/path-to-npm-project/notifi-sdk-ts/node_modules.nosync/babel-preset-react-app/index.js',
    '/path-to-npm-project/notifi-sdk-ts/node_modules.nosync/@babel/runtime/helpers/esm/assertThisInitialized.js',
    '/path-to-npm-project/notifi-sdk-ts/node_modules.nosync/@babel/runtime/regenerator/index.js'
  },
  allowedPaths: [
    '/path-to-npm-project/notifi-sdk-ts/node_modules.nosync/react-scripts/node_modules/react-refresh',
    '/path-to-npm-project/notifi-sdk-ts/node_modules.nosync/react-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/lib',
    '/path-to-npm-project/notifi-sdk-ts/node_modules.nosync/babel-preset-react-app',
    '/path-to-npm-project/notifi-sdk-ts/node_modules.nosync/@babel/runtime/helpers/esm',
    '/path-to-npm-project/notifi-sdk-ts/node_modules.nosync/@babel/runtime/regenerator'
  ]
}
```

There are three properties in the `ModuleScopePlugin`:

- `appSrcs`: the `src/` directory of the project
- `allowedFiles`: the files that are allowed to be imported
- `allowedPaths`: the directories that are allowed to be imported

We will need to add the `css-loader`'s base directory to the `allowedPaths` array by adding the following few lines

```js title="config-overrides.js"
module.exports = function override(config, env) {
  // ...

  // delete-next-line
  config.resolve.plugins = config.resolve.plugins.filter(
    (plugin) => !(plugin instanceof ModuleScopePlugin)
  );

  // add-start
  config.resolve.plugins[0].allowedPaths = [
    ...config.resolve.plugins[0].allowedPaths,
    path.dirname(require.resolve("css-loader")),
  ];
  // add-end

  // ...

  return config;
};
```

Now let's check again the `ModuleScopePlugin`:

```ts
ModuleScopePlugin {
  appSrcs: [
    '/path-to-npm-project/notifi-sdk-ts/packages/notifi-react-example/src'
  ],
  allowedFiles: Set(6) {
    '/path-to-npm-project/notifi-sdk-ts/packages/notifi-react-example/package.json',
    '/path-to-npm-project/notifi-sdk-ts/node_modules.nosync/react-scripts/node_modules/react-refresh/runtime.js',
    '/path-to-npm-project/notifi-sdk-ts/node_modules.nosync/react-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/index.js',
    '/path-to-npm-project/notifi-sdk-ts/node_modules.nosync/babel-preset-react-app/index.js',
    '/path-to-npm-project/notifi-sdk-ts/node_modules.nosync/@babel/runtime/helpers/esm/assertThisInitialized.js',
    '/path-to-npm-project/notifi-sdk-ts/node_modules.nosync/@babel/runtime/regenerator/index.js'
  },
  allowedPaths: [
    '/path-to-npm-project/notifi-sdk-ts/node_modules.nosync/react-scripts/node_modules/react-refresh',
    '/path-to-npm-project/notifi-sdk-ts/node_modules.nosync/react-scripts/node_modules/@pmmmwh/react-refresh-webpack-plugin/lib',
    '/path-to-npm-project/notifi-sdk-ts/node_modules.nosync/babel-preset-react-app',
    '/path-to-npm-project/notifi-sdk-ts/node_modules.nosync/@babel/runtime/helpers/esm',
    '/path-to-npm-project/notifi-sdk-ts/node_modules.nosync/@babel/runtime/regenerator',
    // highlight-next-line
    '/path-to-npm-project/notifi-sdk-ts/node_modules.nosync/css-loader/dist'
  ]
}
```

Now the `css-loader`'s base directory is added to the `allowedPaths` array.

We can try to `npm run start` again, and it should be working as well. This way we do not lose the protection of the `ModuleScopePlugin` and we can still import the `css-loader`.

**Congrates!** 🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀

## Reference

1. [Github issue: create-react-app: Relative imports outside of /src are not supported](https://github.com/bradlc/babel-plugin-tailwind-components/issues/36)

2. [Stakeoverflow: The create-react-app imports restriction outside of src directory](https://stackoverflow.com/questions/44114436/the-create-react-app-imports-restriction-outside-of-src-directory)

3. [Gihub issues: create-react-app should allow TypeScript imports outside src](https://github.com/facebook/create-react-app/issues/8785)

4. [Github issues: How I can disable typechecking when usint typesctipt with CRA?](https://github.com/timarney/react-app-rewired/issues/408)
