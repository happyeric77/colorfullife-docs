---
title: "Npm link"
tags: [nodejs, npm]
---

## Npm link

Npm link is a command that allows us to create a symlink between a global package and a local package. This is particularly useful when we are developing a package and want to test it in a real project.

### Link a global package to a local package (local node project)

In the local package directory, run `npm link` to create a symlink in the global folder.

Say we want to make a local package available globally we can (example: clone [`@notifii-network/notifi-react-card`](https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages/notifi-react-card) to our local machine) run `npm link` in the package directory.

<details>
<summary>Output</summary>

```bash
➜  notifi-react-card git:(main) ✗ npm link

added 1 package, and audited 3 packages in 1s

found 0 vulnerabilities
```

</details>

Then this local package is linked to the global folder. we can confirm it through `npm list -g --depth 0`.

<details>
<summary>Output</summary>

```bash
➜  notifi-react-card git:(main) ✗ npm ls -g --depth=0
/Users/macbookpro4eric/.nvm/versions/node/v18.13.0/lib
├── ...
├── @notifi-network/notifi-react-card@0.77.0 -> ./../../../../../Projects/notifi/notifi-sdk-ts/packages/
└── ...
```

If we do not want this it in our npm global folder anymore, we can run `npm uninstall -g @notifi-network/notifi-react-card` to remove it.

</details>

<details>
<summary>Output</summary>

```bash
➜  notifi-react-card git:(main) ✗ npm uninstall -g @notifi-network/notifi-react-card

removed 1 package, and audited 1 package in 200ms
```

</details>

### Consume the global package

We can consume the linked package in any node project by running `npm link <package-name>` in the project directory.

Here is an [example node project](https://github.com/nimesh-notifi/xmtp-demo) in the `@notifi-network/notifi-react-card` is consumed. we can just simply run `npm link @notifi-network/notifi-react-card` in the project directory. It will override the
`@notifi-network/notifi-react-card` package in the `node_modules` folder with the symlink if it exists.

<details>
<summary>Output</summary>

```bash
➜  xmtp-demo git:(main) ✗ npm link @notifi-network/notifi-react-card
npm WARN ERESOLVE overriding peer dependency
# ...

removed 30 packages, changed 1 package, and audited 3091 packages in 18s

384 packages are looking for funding
  run `npm fund` for details

36 vulnerabilities (12 moderate, 24 high)

To address issues that do not require attention, run:
  npm audit fix

To address all issues possible (including breaking changes), run:
  npm audit fix --force

Some issues need review, and may require choosing
a different dependency.

Run `npm audit` for details.
```

</details>

To check the symblink packages that we are using in the project, we can run `npm ls --link=true`

Two possible outputs:

1. If this dependency is already defined in the `package.json` file, the error will be thrown.

<details>
<summary>Conflict case</summary>

```bash
➜  xmtp-demo git:(main) ✗ npm ls --link=true
xmtp-inbox-web@1.0.0 /Users/macbookpro4eric/Projects/notifi/xmtp-demo
└── @notifi-network/notifi-react-card@npm:notifi-react-card@0.77.0 invalid: "^0.59.2" from the root project -> ./../notifi-sdk-ts/packages/notifi-react-card

npm ERR! code ELSPROBLEMS
npm ERR! invalid: @notifi-network/notifi-react-card@npm:notifi-react-card@0.77.0 /Users/macbookpro4eric/Projects/notifi/xmtp-demo/node_modules/@notifi-network/notifi-react-card

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/macbookpro4eric/.npm/_logs/2023-08-09T07_40_35_108Z-debug-0.log
```

</details>

2. We remove the dependency from the `package.json` file, then it shows

<details>
<summary>Normal case</summary>

```bash
➜  xmtp-demo git:(main) ✗ npm ls --link=true
xmtp-inbox-web@1.0.0 /Users/macbookpro4eric/Projects/notifi/xmtp-demo
└── @notifi-network/notifi-react-card@npm:notifi-react-card@0.77.0 extraneous -> ./../notifi-sdk-ts/packages/notifi-react-card
```

</details>

Then we can make the change locally in the `@notifi-network/notifi-react-card` package and test it in the project. The change will be reflected immediately. 🎉🎉🎉🎉🎉🎉🎉

### Unlink the global package

If we no longer want to use the local package in the project, we can run `npm unlink <package-name>` in the project directory.

<details>
<summary>Output</summary>

```bash
➜  xmtp-demo git:(main) ✗ npm unlink @notifi-network/notifi-react-card
npm WARN ERESOLVE overriding peer dependency
# ...

removed 1 package, and audited 3089 packages in 23s

384 packages are looking for funding
  run `npm fund` for details

36 vulnerabilities (12 moderate, 24 high)

To address issues that do not require attention, run:
  npm audit fix

To address all issues possible (including breaking changes), run:
  npm audit fix --force

Some issues need review, and may require choosing
a different dependency.

Run `npm audit` for details.

```

</details>

To use back the original npm package, we will need to define it back in the `package.json` file and run `npm install` to install it.

:::tip

If you're using npm link to link the local package (ex. `@notifi-network/notifi-react-card` package ) to your project, you may see a linting error in VS Code that suggests adding the package to your project's dependencies.

To get rid of this error, you can add the following line to your project's .eslintrc file:

<details>
<summary>Example</summary>

```
'@notifi-network/notifi-react-card' should be listed in the project's dependencies. Run 'npm i -S @notifi-network/notifi-react-card' to add it eslint
```

</details>

To get rid of this error, you can add the following line to your project's `.eslintrc.json` file. Replace the `"/Your/global/node_modules/node_modules"` with your global node_modules path.

```json
{
  "settings": {
    "import/resolver": {
      "node": {
        "paths": ["src"],
        "extensions": [".js", ".jsx", ".ts", ".tsx"],
        "moduleDirectory": [
          "node_modules",
          "/Your/global/node_modules/node_modules"
        ]
      }
    }
  }
}
```

This configuration tells ESLint to resolve imports using the src directory as the root directory, and to look for modules in both the node_modules and global node_modules directory.

This should allow ESLint to resolve the @notifi-network/notifi-react-card package correctly, even though it's not listed in your project's dependencies.

:::

## yarn link

Simiilarily, yarn also has a command called `yarn link` that does the same thing as `npm link`.

Here we also want to have a small use case to demonstrate how to use `yarn link`.

### Register a package (`A`) to the global folder

Under the `A` package directory, run `yarn link` to register the package to the global folder.

<details>
<summary>Output</summary>

```bash
❯ mkdir A
❯ mkdir B
❯ cd A
❯ yarn init -y
yarn init v1.22.19
warning The yes flag has been set. This will automatically answer yes to all questions, which may have security implications.
success Saved package.json
✨  Done in 0.03s.
❯ yarn link
yarn link v1.22.19
success Registered "A".
info You can now run `yarn link "A"` in the projects where you want to use this package and it will be used instead.
✨  Done in 0.04s.
```

</details>

Then we can see the `A` package is registered in the global folder by running

```bash
# macOS & Linux
ls ~/.config/yarn/link
```

### Unregister the package (`A`)

We can also unregister the package by running `yarn unlink` in the `A` package directory.

<details>
<summary>Output</summary>

```bash
❯ yarn unlink
yarn unlink v1.22.19
success Unregistered "A".
info You can now run `yarn unlink "A"` in the projects where you no longer want to use this package.
✨  Done in 0.04s.

```

</details>

### Consume the global package in another project (`B`)

Under the `B` package directory, run `yarn link A` to consume the global package `A`.

<details>
<summary>Output</summary>

```bash
❯ cd ../B
❯ yarn init -y
yarn init v1.22.19
warning The yes flag has been set. This will automatically answer yes to all questions, which may have security implications.
success Saved package.json
✨  Done in 0.03s.
❯ yarn link A
yarn link v1.22.19
success Using linked package for "A".
✨  Done in 0.04s.
```

</details>

Then we are able to use local `A` package in the `B` project without pushing the changes to the npm registry.

### Unlink the global package

To unlink the global package, we can run `yarn unlink A` in the `B` project directory.

```bash
❯ yarn unlink A
yarn unlink v1.22.19
success Removed linked package "A".
info You will need to run `yarn install --force` to re-install the package that was linked.
✨  Done in 0.04s.
```

Then we can run `yarn install --force` to install the original package back.

## yalc

npm or yarn link is a good way to test the local package in the project. However, the symbolic linking solution might not work in all cases especially we have so many bundler tools like webpack, rollup, etc. in the project.

> NPM and Yarn address this issue with a similar approach of symlinked packages (npm/yarn link). Though this may work in many cases, it often brings nasty constraints and problems with dependency resolution, symlink interoperability between file systems, etc.
> Quoted from yalc doc

[`yalc`](https://www.npmjs.com/package/yalc) in this case is a good alternative to `npm link` or `yarn link`.

### Working flow of yalc with small example

We will use one of my local packages `@notifii-network/notifi-react-card` and `vue-dummy-project` as example to showcase how to use `yalc`.

- `@notifii-network/notifi-react-card` is a local package that we want to test in the `vue-dummy-project` project.
- `vue-dummy-project` is a vue project that we want to test the `@notifii-network/notifi-react-card` package.

#### Step 1: npx yalc publish

When you run `yalc publish` in the package directory, it grabs only files that should be published to NPM and puts them in a special global store (located, for example, in ~/.yalc).

So lets run `npx yalc publish` in the `@notifii-network/notifi-react-card` package directory.

<detail>
<summary>demo</summary>

```bash
❯ cd ~/.yalc
❯ ls
installations.json packages
❯ cd packages
❯ ls
@notifi-network
❯ cd @notifi-network
❯ ls
notifi-react-card
    ~/.y/packages/@notifi-network 
```

</detail>

#### Step 2: npx yalc add

When you run `yalc add <package>` in your project it pulls package content into .yalc in the current folder and injects a file:/link: dependency into package.json

So we can run `npx yalc add @notifi-network/notifi-react-card` in the `vue-dummy-project` project directory.

<detail>
<summary>demo</summary>

```bash
❯ npx yalc add @notifi-network/notifi-react-card
Package @notifi-network/notifi-react-card@0.84.0 added ==> /Users/macbookpro4eric/Projects/notifi/ref/vue-dummy-project/node_modules/@notifi-network/notifi-react-card
```

</detail>

#### Other operation

yalc also have some other operations that might also be useful such as `remove`, `installation`.

Checkout the [yalc doc](https://www.npmjs.com/package/yalc) for more details.

:::tip

We need to be cautious that the bundler for some reason might not rebuild the updated package. For example `.next` (next project) or `.vite` (vite project) folder might not be updated. In this case, we need to manually remove the folder and rebuild the project.

:::
