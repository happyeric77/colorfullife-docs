---
title: "Npm link"
tags: [nodejs, npm]
---

# Npm link

Npm link is a command that allows us to create a symlink between a global package and a local package. This is particularly useful when we are developing a package and want to test it in a real project.

## Link a global package to a local package (local node project)

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

## Consume the global package

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

## Unlink the global package

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
