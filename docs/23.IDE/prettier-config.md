---
title: Prettier Config
tags: [vscode, prettier, ide]
---


The `prettier.configPath` setting is intended to explicitly define a configuration path for Prettier, and it does override local .prettierrc files when set. This can be useful in scenarios where a consistent formatting configuration is desired across multiple projects, but it does not support a fallback mechanism inherently.

For most use cases, especially when working across multiple projects with potentially different formatting rules, it's best to leave the prettier.configPath setting undefined (or empty) in the User settings. This allows Prettier to automatically resolve to the nearest .prettierrc file in each project, providing the flexibility to define project-specific formatting rules.

If you need a global default configuration but still want to allow project-specific overrides, the best approach is to not set prettier.configPath globally and instead rely on each project's local .prettierrc file. For projects that do not contain a local configuration file, you could manually add a .prettierrc file pointing to your preferred global settings or use the manual linking strategy discussed previously to link to a global configuration file as needed.

This setup ensures that Prettier behaves as expected, using local configurations when available and falling back to default settings or a manually specified global configuration only when necessary.


## Case #1: use global prettier setting in vscode

In this case, all projects will use the same prettier setting even the project has its own prettier setting.

```json title='/Users/macbookpro4eric/Library/Application Support/Code/User/settings.json'
{
// .. others
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  // highlight-start
  "prettier.singleQuote": false,
  "prettier.tabWidth": 2,
  "prettier.printWidth": 80,
  // highlight-end
  "editor.tabSize": 2,
  "editor.formatOnSave": true,
}
// ... others
```

## Case #2: 

In this case, prettier will use the project's prettier setting if it has one. But the global config will not take effect. So we need to ensure that all projects have their own prettier setting.


```json title='/Users/macbookpro4eric/Library/Application Support/Code/User/settings.json'
{
// .. others
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  // highlight-next-line
  "prettier.configPath": "./.prettierrc",
  "editor.tabSize": 2,
  "editor.formatOnSave": true,
}
// ... others
```
