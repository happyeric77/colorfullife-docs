// Hand-curated Open Source showcase data.
// No GitHub API calls at build time: the list stays stable, fast and
// editorial. Add or edit entries here.

export const groups = [
  { id: "public-sdk-work", label: "Public SDK Work" },
  { id: "joplin-tooling", label: "Joplin Tooling" },
  { id: "agent-tooling", label: "Agent Tooling" },
  { id: "home-automation", label: "Home Automation" },
];

export const repositories = [
  {
    name: "Notifi DApp Example",
    repository:
      "https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages/notifi-dapp-example",
    description:
      "A reusable full-page integration baseline for customer-hosted Notifi experiences.",
    organization: "Notifi Network",
    language: "TypeScript",
    license: "MIT",
    group: "public-sdk-work",
    featured: false,
    relatedProject: "sdk-architecture",
  },
  {
    name: "Notifi Wallet Provider",
    repository:
      "https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages/notifi-wallet-provider",
    description:
      "A unified React wallet layer for multi-chain Notifi integrations.",
    organization: "Notifi Network",
    language: "TypeScript",
    license: "MIT",
    group: "public-sdk-work",
    featured: false,
    relatedProject: "sdk-architecture",
  },
  {
    name: "joplin.nvim",
    repository: "https://github.com/happyeric77/joplin.nvim",
    description: "Neovim integration for Joplin notes and notebooks.",
    language: "Lua",
    license: "MIT",
    group: "joplin-tooling",
    featured: true,
  },
  {
    name: "mcp-joplin",
    repository: "https://github.com/happyeric77/mcp-joplin",
    description: "MCP server for accessing Joplin through the Web Clipper API.",
    language: "TypeScript",
    license: "MIT",
    group: "joplin-tooling",
    featured: false,
  },
  {
    name: "joplin-api",
    repository: "https://github.com/happyeric77/joplin-api",
    description: "Headless Joplin Data API server with WebDAV sync support.",
    language: "Shell",
    group: "joplin-tooling",
    featured: false,
  },
  {
    name: "agent-webhook-notify",
    repository: "https://github.com/happyeric77/agent-webhook-notify",
    description: "Webhook notifications for agent completion and blocked states.",
    language: "JavaScript",
    license: "MIT",
    group: "agent-tooling",
    featured: true,
  },
  {
    name: "agent-keep-awake",
    repository: "https://github.com/happyeric77/agent-keep-awake",
    description: "Keeps macOS awake while local agents are working.",
    language: "JavaScript",
    license: "MIT",
    group: "agent-tooling",
    featured: false,
  },
  {
    name: "wyoming-cloud-tts",
    repository: "https://github.com/happyeric77/wyoming-cloud-tts",
    description:
      "Wyoming Protocol TTS adapter for Home Assistant with multilingual cloud speech synthesis.",
    language: "TypeScript",
    group: "home-automation",
    featured: true,
    relatedProject: "home-assistant",
  },
  {
    name: "wyoming-groq-whisper-adapter",
    repository: "https://github.com/happyeric77/wyoming-groq-whisper-adapter",
    description:
      "Wyoming Protocol speech-to-text adapter connecting Home Assistant to Groq Whisper.",
    language: "TypeScript",
    group: "home-automation",
    featured: false,
  },
];
