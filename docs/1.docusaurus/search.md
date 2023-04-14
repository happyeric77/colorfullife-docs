---
title: Search bar
description: implement search bar
tags: [docusaurus]
---

# Use Argolia to implement search bar

See [official doc](https://docusaurus.io/docs/search) for more details about Argolia.

> `Docusaurus' own @docusaurus/preset-classic supports Algolia DocSearch integration. If you use the classic preset, no additional installation is needed.`
>
> Source: [official doc](https://docusaurus.io/docs/search#connecting-algolia)

## Apply for Algolia DocSearch API key

Before getting start, we need to have an Algolia DocSearch API key. Make sure your website is public and accessible by Algolia and then go to [this page](https://docsearch.algolia.com/apply/) to apply for an API key.

:::info
According to the instruction, the application takes up to 2 weeks to be reviewed.
:::

## Add Algolia DocSearch API key to docusaurus.config.js

Then you will get the email with the following content

:::info

Congratulations, your search is now ready! We've successfully created your DocSearch app, please follow the steps in order to implement DocSearch on your website:

Accept this invitation to join your application and get started!

If you need to do update to your indexing, please use our web interface:

- Trigger or get an overview of your crawls
- Edit, update and see your config

Implement DocSearch on your website
After you've accepted the invitation to join your application, you can start using DocSearch!

CSS
Copy this snippet at the end of the HTML < head > tag

```js

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@docsearch/css@3"/></pre></li>

```

JavaScript
Copy this snippet at the end of the HTML < body > tag

```js

<script src="https://cdn.jsdelivr.net/npm/@docsearch/js@3"></script>


<script type="text/javascript">

  docsearch({
    // highlight-start
    appId: "<YOUR_APP_ID>",

    apiKey: "<YOUR_API_KEY>" ,

    indexName: "<YOUR_INDEX_NAME>",
    // highlight-end

    container: '### REPLACE ME WITH A CONTAINER (e.g. div) ###'

    debug: false // Set debug to true if you want to inspect the modal

  });

</script>

```

You can read more about other implementation methods on our documentation

Troubleshooting
If you encounter an issue during the setup, or with your Algolia app don't hesitate to:

- Browse our documentation to see if it's documented
- See/open an issue on GitHub
- Contact us via email, Twitter or Discord

Have a great day,
Enjoy DocSearch <3

:::

From the email, we get the following information:

1. `appId`
2. `apiKey`
3. `indexName`

Then we can add the following code to `docusaurus.config.js`

```js title="docusaurus.config.js"
module.exports = {
  // ...
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // ...
      algolia: {
        appId: "appId",
        apiKey: "apiKey",
        indexName: "indexName",
      },
    }),
  // ...
};
```

There are some other options that we can add to `algolia` object. See [official doc](https://docusaurus.io/docs/2.0.1/search#connecting-algolia) for more details.

Then we can run `yarn start` to see the search bar showing on the top right corner.

If you want to customize the search bar, it provides some options. See [official doc](https://docusaurus.io/docs/2.0.1/search#customizing-the-algolia-search-behavior) for more details.

Congratulation ..... 🎉🎉🎉
