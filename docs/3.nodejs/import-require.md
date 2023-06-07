---
title: "Err - Can't import named export"
tags: [nodejs, axios, express]
---

# Named export & Default export

Firstly, we need to understand the difference between named export and default export.

ES6 introduces two ways to export a module from a file: named export and default export.

1. By using named exports, one can have multiple named exports per file. Then import the specific exports they want surrounded in braces.

```js
// named-exports.js
export const namedExport1 = () => {};
export const namedExport2 = () => {};
```

We can also import all named exports at once with the following syntax:

```js
import * as allExports from "./named-exports.js";
```

2. By using default exports, one can only have one default export per file. Then import the default export by omitting the curly braces.

```js
// default-export.js
const defaultExport = () => {};
export default defaultExport;
```

Then, we can get to the issue ...

```bash
./node_modules/@notifi-network/notifi-react-card/dist/index.js Can't import the named export 'GqlError' from non EcmaScript module (only default export is available)
```

In this case, we will use `notifi-react-card` SDK as an example with the following node env.

```
"react": "17.0.2",
"react-router-dom": "5.2.0",
"react-scripts": "4.0.3",
"notifi-react-card": "0.58.0",
```

## Reason

after looking into the `notifi-react-card` package file, we can see that it serves only ".mjs" file.

```json title="package.json"
"module": "dist/index.mjs",
```

But webpack version 4.44.2 used by `react-scripts` somehow packs the `notifi-react-card` package into a commonJS module and not able to auto resolve the mjs.

There are two ways to solve this issue.

## Solution #1

Update the `react-scripts` to > 5.0.1. And it will use webpack version 5 which is able to auto resolve the mjs.

## Solution #2

In the `notifi-react-card` package file, replace "module" with the one able to dynamically resolve the mjs and cjs --> `exports` field.

```json title="package.json"
"exports": {
    ".": {
      "require": "./dist/index.js",
      "import": "./dist/index.mjs"
    },
  }
```

🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉
