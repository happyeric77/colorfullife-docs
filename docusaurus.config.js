// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "ColorfulLife-Docs",
  tagline: "Make your life colorful",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://docs.colorfullife.ml",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "colorfullife", // Usually your GitHub org/user name.
  projectName: "colorfullife", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/happyeric77/colorfullife-docs/tree/master/",
        },
        blog: false,
        // blog: {
        //   showReadingTime: true,
        //   // Please change this to your repo.
        //   // Remove this to remove the "edit this page" links.
        //   editUrl: "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        // },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: "img/docusaurus-social-card.jpg",
      navbar: {
        title: "ColorfulLife Docs",
        logo: {
          alt: "My Site Logo",
          src: "img/logo.png",
        },
        items: [
          // {
          //   type: "docSidebar",
          //   sidebarId: "tutorialSidebar",
          //   position: "left",
          //   label: "Tutorial",
          // },
          // { to: "/blog", label: "Blog", position: "left" },
          {
            href: "https://github.com/happyeric77/colorfullife-docs",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      colorMode: {
        defaultMode: "dark",
        disableSwitch: false,
      },
      footer: {
        style: "dark",
        links: [
          // {
          //   title: "Docs",
          //   items: [
          //     {
          //       label: "Tutorial",
          //       to: "/docs/intro",
          //     },
          //   ],
          // },
          {
            title: "Community",
            items: [
              // {
              //   label: "Stack Overflow",
              //   href: "https://stackoverflow.com/questions/tagged/docusaurus",
              // },
              {
                label: "Youtube",
                href: "https://www.youtube.com/channel/UCwvJhJwr64cM7QUSg9nP4Bg",
              },
              {
                label: "Twitter",
                href: "https://twitter.com/happyeric77",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "ColorfulLife Blog",
                to: "https://blog.colorfullife.ml/pages/diary/erics-daily-life/",
              },
              {
                label: "HackMD",
                href: "https://hackmd.io/@happyeric77",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} ColorfulLife, Inc. All rights reserved`,
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
    }),
  // Mermaid graph feature: https://mermaid.js.org/syntax/pie.html
  markdown: {
    mermaid: true,
  },

  themes: ["@docusaurus/theme-mermaid"],
};

module.exports = config;
