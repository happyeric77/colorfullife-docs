---
title: Last Update Info
---

# How to show last updated info (time & author)

Docusaurus allows us to show the info of last updated time and author by simply adding some config parameters.

There is a plugin called `@docusaurus/plugin-content-docs` which contain many options to let the doc page display even more information.

This plugin is included in @docusaurus/preset-classic, so we don't need to install it.

## How to show last updated info

To show the last updated info, we need to add the following config in `docusaurus.config.js`:

```js
module.exports = {
  // ...
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          // ...
          // add-start
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
          // add-end
          // ...
        },
        // ...
      }),
    ],
  ],
};
```

If can get more more about what info can be used, please check out the [official docs](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-docs#showLastUpdateTime).

:::note

Remember that the it will only show dummy info as below when your page is running in development mode (localhost).

```
Last updated on 10/14/2018
(Simulated during dev for better perf)
```

The reason is that getting the info using git log is expensive, so it is only enabled in production mode. Here is the [WHY](https://github.com/facebook/docusaurus/discussions/7229)

:::
