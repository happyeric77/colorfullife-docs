// Hand-curated Open Source showcase data.
// No GitHub API calls at build time: the list stays stable, fast and
// editorial. Add or edit entries here.

export const groups = [
  { id: "joplin-tooling", label: "Joplin Tooling" },
  { id: "agent-tooling", label: "Agent Tooling" },
  { id: "home-automation", label: "Home Automation" },
];

export const repositories = [
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
    name: "ollama-opencode-adapter",
    repository: "https://github.com/happyeric77/ollama-opencode-adapter",
    description:
      "An Ollama-compatible adapter that routes requests through OpenCode providers.",
    language: "TypeScript",
    group: "agent-tooling",
    featured: true,
  },
  {
    name: "agent-webhook-notify",
    repository: "https://github.com/happyeric77/agent-webhook-notify",
    description: "Webhook notifications for agent completion and blocked states.",
    language: "JavaScript",
    group: "agent-tooling",
    featured: false,
  },
  {
    name: "agent-keep-awake",
    repository: "https://github.com/happyeric77/agent-keep-awake",
    description: "Keeps macOS awake while local agents are working.",
    language: "JavaScript",
    group: "agent-tooling",
    featured: false,
  },
  {
    name: "wyoming-cloud-tts",
    repository: "https://github.com/happyeric77/wyoming-cloud-tts",
    description:
      "A Wyoming Protocol TTS adapter for Home Assistant with multilingual cloud speech synthesis.",
    language: "TypeScript",
    group: "home-automation",
    featured: true,
    relatedProject: "home-assistant",
  },
  {
    name: "wyoming-groq-whisper-adapter",
    repository: "https://github.com/happyeric77/wyoming-groq-whisper-adapter",
    description:
      "A Wyoming Protocol speech-to-text adapter connecting Home Assistant to Groq Whisper.",
    language: "TypeScript",
    group: "home-automation",
    featured: false,
    relatedProject: "home-assistant",
  },
];
