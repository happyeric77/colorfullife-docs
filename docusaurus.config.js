// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

const editUrl = "https://github.com/happyeric77/colorfullife-docs/tree/master/";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Eric Lee — Engineering Journal",
  tagline: "I build software and write about how it gets made.",
  favicon: "img/favicon.svg",

  // Set the production url of your site here
  url: "https://docs.dev-eric.work",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "happyeric77", // Usually your GitHub org/user name.
  projectName: "colorfullife-docs", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  stylesheets: [
    "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800;900&family=Geist+Mono:wght@400;500;600&display=swap",
  ],
  headTags: [
    // Marks the document for the reveal-on-scroll CSS; without JS the
    // content is never hidden and stays fully readable.
    {
      tagName: "script",
      attributes: {},
      innerHTML: "document.documentElement.classList.add('reveal-ready');",
    },
  ],
  plugins: [
    ["drawio", {}],
    // Aggregates Project / Journal / Topic metadata for cross-content pages.
    "./plugins/content-model",
    [
      "@docusaurus/plugin-content-docs",
      // Second docs instance: Projects are content (MDX), not hardcoded data.
      {
        id: "projects",
        path: "projects",
        routeBasePath: "projects",
        sidebarPath: false,
        breadcrumbs: false,
        editUrl,
      },
    ],
  ],
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          // Legacy tech notes live under /archive and keep docs-style navigation.
          routeBasePath: "archive",
          sidebarPath: require.resolve("./sidebars.js"),
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl,
        },
        blog: {
          routeBasePath: "journal",
          blogTitle: "Journal",
          blogDescription:
            "Stories from the work: build logs, deep dives, retrospectives and field notes.",
          blogSidebarTitle: "Latest entries",
          showReadingTime: true,
          editUrl,
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "ERIC / ENGINEERING",
        items: [
          {
            to: "/projects",
            label: "Projects",
            position: "left",
          },
          {
            to: "/journal",
            label: "Journal",
            position: "left",
          },
          {
            to: "/topics",
            label: "Topics",
            position: "left",
          },
          {
            to: "/opensource",
            label: "Open Source",
            position: "left",
          },
          {
            to: "/archive",
            label: "Archive",
            position: "left",
          },
          {
            href: "https://github.com/happyeric77/colorfullife-docs",
            label: "GitHub ↗",
            position: "right",
          },
        ],
      },
      colorMode: {
        defaultMode: "dark",
        disableSwitch: false,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        magicComments: [
          // Remember to extend the default highlight class name as well!
          {
            className: "code-block-highlighted-line",
            line: "highlight-next-line",
            block: { start: "highlight-start", end: "highlight-end" },
          },
          {
            className: "code-block-error-line",
            line: "error-next-line",
            block: { start: "error-start", end: "error-end" },
          },
          {
            className: "code-block-added-line",
            line: "add-next-line",
            block: { start: "add-start", end: "add-end" },
          },
          {
            className: "code-block-deleted-line",
            line: "delete-next-line",
            block: { start: "delete-start", end: "delete-end" },
          },
        ],
      },
      algolia: {
        appId: "WW3EG7I07T",
        apiKey: "e71ea8f5f3dab4e20bd6f4bed0c643be",
        indexName: "colorfullife",
      },
    }),
  // Mermaid graph feature: https://mermaid.js.org/syntax/pie.html
  markdown: {
    mermaid: true,
  },

  themes: ["@docusaurus/theme-mermaid"],
};

module.exports = config;
