---
title: Comment System
---

# Docusaurus Comment System

To add a comment system to Docusaurus site, we can make use of the [Giscus](https://giscus.app/) comment system.

## Prerequisites

We will need to go to [Giscus](https://giscus.app/) to connect our GitHub account to Giscus app. Then we can select the repository that we want to use for the comment system.

Finally, fill in the required info in the form in [Giscus](https://giscus.app/). It will generate the needed information as a snippet of code.

The code snippet is for vanilla JavaScript. We will need a [npm package](https://github.com/giscus/giscus-component) to integrate it with Docusaurus.

## Install Giscus

```bash
npm i @giscus/react
```

Then put the following tag in any Compoent that we want to add the comment system to.

```tsx
<Giscus
  id="comments"
  repo="giscus/giscus-component"
  repoId="Your repoId"
  category="Announcements"
  categoryId="Your categoryId"
  mapping="specific"
  term="Welcome to @giscus/react component!"
  reactionsEnabled="1"
  emitMetadata="0"
  inputPosition="top"
  theme="light"
  lang="en"
  loading="lazy"
/>
```

Repace the info accordingly and you will see the comment block shows up.

But our component is not showing up in default theme. We will need to swizzle the component to make it work.

## Swizzle the component

```bash

npm run swizzle

```

Select the theme that we want to swizzle. In this case, we will select `@docusaurus/theme-classic`.

```bash
✔ Select a theme to swizzle: › @docusaurus/theme-classic
```

Then select the component that we want to swizzle. In this case, we will select `DocItem/Layout`.

```bash
✔ Select or type the component to swizzle.
* = not safe for all swizzle actions
 › DocItem/Layout (Unsafe)

```

Finally, select the swizzle action. In this case, we will select `Eject (Unsafe)`.

```bash
✔ Which swizzle action do you want to do? › Eject (Unsafe)
[WARNING]
Swizzle action eject is unsafe to perform on DocItem/Layout.
It is more likely to be affected by breaking changes in the future
If you want to swizzle it, use the `--danger` flag, or confirm that you understand the risks.

✔ Do you really want to swizzle this unsafe internal component? › YES: I know what I am doing!
[SUCCESS]
Ejected DocItem/Layout from theme-classic to
- "/Users/macbookpro4eric/Projects/docs/colorfullife-docs/src/theme/DocItem/Layout/index.js"
- "/Users/macbookpro4eric/Projects/docs/colorfullife-docs/src/theme/DocItem/Layout/styles.module.css"
```

Then we will see two files are created in the `src/theme/DocItem/Layout` folder.

1. `index.js`
2. `styles.module.css`

Open the `index.js` file and add the following code.

```tsx
// ...
import styles from "./styles.module.css";
// add-start
import Giscus from "@giscus/react";
import { useColorMode } from "@docusaurus/theme-common";
// add-end
/**
 * Decide if the toc should be rendered, on mobile or desktop viewports
 */

//...

export default function DocItemLayout({ children }) {
  const docTOC = useDocTOC();
  // add-next-line
  const { colorMode } = useColorMode();
  return (
    <div className="row">
      {/* ... */}
      <DocItemPaginator />
      {/*add-start*/}
      <Giscus
        id="comments"
        repo="happyeric77/colorfullife-docs"
        repoId="R_kgDOJUJ8oQ"
        category="Show and tell"
        categoryId="DIC_kwDOJUJ8oc4CVsZB"
        mapping="pathname"
        term="Welcome to @giscus/react component!"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={colorMode ? "dark" : "light"}
        lang="en"
        loading="lazy"
      />
      {/*add-end*/}
      {/* ... */}
    </div>
  );
}
```

Then we will see the comment system shows up every single doc page.
