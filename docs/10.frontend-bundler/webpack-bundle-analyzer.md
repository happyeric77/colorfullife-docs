---
title: Bundle Analyzer
tags: [webpack, bundle-analyzer]
---

Bundle Analyzer is a useful tool to analyze the bundle composition and size. It is particularly useful when we implement code splitting (or lazy loading) in our app and want to know the size of each chunk.

## How to use

After installing [webpack-bundle-analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer) by `npm i webpack-bundle-analyzer`, we can create a javascript script to run the analyzer in the project root directory.

```js title="./analyze-bundle.js"
// Set NODE_ENV to production
process.env.NODE_ENV = "production";

// Get webpack config
const webpack = require("webpack");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const webpackConfig = require("react-scripts/config/webpack.config.js")(
  process.env.NODE_ENV
);

// Add BundleAnalyzerPlugin
webpackConfig.plugins.push(new BundleAnalyzerPlugin());

// Add other necessary webpack config (depends on project needs)
// webpackConfig.resolve.fallback = {
//   ...webpackConfig.resolve.fallback,
//   stream: require.resolve('stream-browserify'),
//   crypto: require.resolve('crypto-browserify'),
//   buffer: require.resolve('buffer'),
// };

// Run webpack. The bundle analyzer will be opened in browser automatically listening on port 8888
webpack(webpackConfig, (err, stats) => {
  if (err || stats.hasErrors()) {
    console.error(err);
  }
});
```

Then we can run the script by `node analyze-bundle.js`. The bundle analyzer will be opened in browser automatically listening on port 8888.

## Real life example

Lets implement an dynamic import in our library (notifi-react-card) to see if the bundle analyzer can help us to analyze the bundle size.

<details>
<summary>Code: w/o dynamic import</summary>

```tsx
// ...
import { marked } from "marked";
import { getAlertDetailsContents } from "notifi-react-card/lib/utils";

export const AlertDetailsCard: React.FC<AlertDetailsProps> = ({
  notificationEntry,
  classNames,
}) => {
  // ...
  const html = DOMPurify.sanitize(
    marked.parse(
      "# Marked in Node.js\n\nRendered by **marked**\n[click here](https://google.com)."
    )
  );

  return (
    <div
      className={clsx(
        "NotifiAlertDetails__container",
        classNames?.detailsContainer
      )}
    >
      {/* ... */}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};
```

</details>

<details>
<summary>Code: w/ dynamic import</summary>

```tsx
// ...

export const AlertDetailsCard: React.FC<AlertDetailsProps> = ({
  notificationEntry,
  classNames,
}) => {
  // ...

  const getHtml = async () => {
    const marked = await import("marked").then((module) => module.marked);
    const DOMPurify = await import("dompurify").then(
      (module) => module.default
    );
    return DOMPurify.sanitize(
      marked.parse(
        "# Marked in Node.js\n\nRendered by **marked**\n[click here](https://google.com). <script>alert(1);</script>"
      )
    );
  };

  const [html, setHtml] = React.useState("");
  useEffect(() => {
    getHtml().then((res) => {
      setHtml(res);
    });
  }, []);

  return (
    <div
      className={clsx(
        "NotifiAlertDetails__container",
        classNames?.detailsContainer
      )}
    >
      {/* ... */}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};
```

</details>

Then we can run the bundle analyzer to see the bundle size.

![](/img/docs-webpack-analyzer.png)

We can see that the bundle size is reduced. The `marked` is moved to a separate chunk.🎉
