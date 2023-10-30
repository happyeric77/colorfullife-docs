---
title: "nvm: Node Version Manager"
tags: [nodejs, npm]
---

## ERROR: Failed to find package "XXX". You may have used the "--no-optional" flag when running "npm install".

Error message:

```
❯ npm install -g bun
npm ERR! code 1
npm ERR! path /Users/macbookpro4eric/.nvm/versions/node/v18.13.0/lib/node_modules/bun
npm ERR! command failed
npm ERR! command sh -c -- node install.js
npm ERR! Failed to find package "@oven/bun-darwin-aarch64". You may have used the "--no-optional" flag when running "npm install".
npm ERR! Error: Failed to install package "bun"
npm ERR!     at /Users/macbookpro4eric/.nvm/versions/node/v18.13.0/lib/node_modules/bun/install.js:311:11
npm ERR!     at Generator.throw (<anonymous>)
npm ERR!     at rejected (/Users/macbookpro4eric/.nvm/versions/node/v18.13.0/lib/node_modules/bun/install.js:35:27)
npm ERR!     at process.processTicksAndRejections (node:internal/process/task_queues:95:5)

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/macbookpro4eric/.npm/_logs/2023-10-28T13_25_06_686Z-debug-0.log
```

The reason is that I migrated all my data from Intel i5 to M1 using Apple migration assistant it was using x64 or Intel-compatible node version.
if using nvm, you can check it with the command

```
ls ~/.nvm/.cache/bin
```

<details>
<summary>My output</summary>

```bash
❯ ls ~/.nvm/.cache/bin
node-v14.21.3-darwin-x64   node-v16.19.1-darwin-x64   node-v17.3.0-darwin-x64    node-v18.13.0-darwin-x64   node-v18.18.2-darwin-arm64
```

</details>

To fix it, we need to reinstall the correct version for ARM processor which is with the suffix `darwin-arm64` instead of `darwin-x64`.

```bash
❯ nvm use 18.18.2
Now using node v18.18.2 (npm v9.8.1)
❯ nvm uninstall 18.13.0 && nvm install 18.13.0
Uninstalled node v18.13.0
Downloading and installing node v18.13.0...
Downloading https://nodejs.org/dist/v18.13.0/node-v18.13.0-darwin-arm64.tar.xz...
################################################################################################################################################### 100.0%
Computing checksum with shasum -a 256
Checksums matched!
Now using node v18.13.0 (npm v8.19.3)
❯ ls ~/.nvm/.cache/bin
node-v14.21.3-darwin-x64   node-v17.3.0-darwin-x64    node-v18.13.0-darwin-x64
node-v16.19.1-darwin-x64   node-v18.13.0-darwin-arm64 node-v18.18.2-darwin-arm64
```

new when we try to install `bun` again, it can be done successfully.

```bash
❯ nvm use 18.13.0
Now using node v18.13.0 (npm v8.19.3)
❯ node --version
v18.13.0
❯ npm install -g bun

changed 7 packages, and audited 3 packages in 6s

found 0 vulnerabilities
```

- Reference: https://github.com/oven-sh/bun/issues/5806
