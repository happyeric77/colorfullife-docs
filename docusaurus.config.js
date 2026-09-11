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

  url: "https://docs.dev-eric.work",
  baseUrl: "/",

  organizationName: "happyeric77",
  projectName: "colorfullife-docs",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  stylesheets: [
    "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800;900&family=Geist+Mono:wght@400;500;600&display=swap",
  ],
  headTags: [
    {
      tagName: "script",
      attributes: {},
      innerHTML: "document.documentElement.classList.add('reveal-ready');",
    },
  ],
  plugins: [
    ["drawio", {}],
    "./plugins/content-model",
    [
      "@docusaurus/plugin-content-docs",
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
          routeBasePath: "archive",
          sidebarPath: require.resolve("./sidebars.js"),
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
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
      image: "img/social-card.png",
      navbar: {
        title: "Eric Lee",
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
            href: "https://profile.dev-eric.work",
            label: "Profile ↗",
            position: "right",
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
  markdown: {
    mermaid: true,
  },

  themes: ["@docusaurus/theme-mermaid"],
};

module.exports = config;
