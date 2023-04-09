---
title: Get Started
tags: [docusaurus]
description: Get started with docusaurus
---

# Init a new documentation site with docusaurus

```bash
npx @docusaurus/init@latest init my-website classic --typescript
```

After doing this, you can start the development server with:

```bash
cd my-website
yarn start
```

## Basic customization

### Remove the blog section

Docusaurus supports both doc and blog websites. But I just want to create a doc website.

I also do not need the `Blog` and `Tutorial` item in the navbar.

So the next step is to remove the blog folder and the blog-related code in the `docusaurus.config.js` file.

```js
presets: [
  [
    "classic",
    /** @type {import('@docusaurus/preset-classic').Options} */
    ({
      // add-next-line
      blog: false,
      // delete-start
      blog: {
        showReadingTime: true,
        // Please change this to your repo.
        // Remove this to remove the "edit this page" links.
        editUrl: "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
      },
      // delete-end
    }),
  ],
],
themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: "img/docusaurus-social-card.jpg",
      navbar: {
        ...
        items: [
          // delete-start
          {
            type: "docSidebar",
            sidebarId: "tutorialSidebar",
            position: "left",
            label: "Tutorial",
          },
          { to: "/blog", label: "Blog", position: "left" },
          // delete-end
          {
            href: "https://github.com/happyeric77/colorfullife-docs",
            label: "GitHub",
            position: "right",
          },
        ],
      }
    }),
```

### Remove index page and related code

My usage is primarily to create a documentation website for my own projects. So I don't need the index page.
And I also want to remove associated style and react components.

```
./src
├── components
├── css
│   └── custom.css
└── pages
```

### Start writing docs 🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉

Now you can start writing docs in the `docs` folder by creating markdown files by referring to the [docs](https://docusaurus.io/docs/docs-introduction) section.

Here it is the [inital version](https://github.com/happyeric77/colorfullife-docs/releases/tag/v0.0.0) of my documentation website.
