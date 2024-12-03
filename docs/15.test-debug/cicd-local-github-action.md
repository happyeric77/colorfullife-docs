---
title: Run github action locally with act
tags: [cicd, github-action, act]
---

## Pre-requisite

- A github project repository with github action setup.

## Installations

### Docker

- Install [docker desktop](https://www.docker.com/)

- config the environment variable in `~/.zshrc` or `~/.bashrc` file by adding the following line:

```bash
export PATH=$PATH:/Applications/Docker.app/Contents/Resources/bin

source ~/.zshrc
```

### act

- Install [act](https://github.com/nektos/act)

```bash
brew install act
```

- Update `act` configuration file.

```bash title="~/.actrc (create one if not yet have one)"
--container-daemon-socket -
-P ubuntu-latest=node:18.20.4
--container-architecture linux/arm64
--container-options "--memory=16g"
--container-options "--cpus=8"
```

:::info

- If you are using Apple M series chip or other ARM-based chips, you can use `linux/arm64` as the architecture.
- About `--container-daemon-socket -`, see the detail [here](https://github.com/nektos/act/issues/2239#issuecomment-1979819940). It is a work around for docker ws mounting issue.

- Define the node version if needed using `-P ubuntu-latest=node:18.20.4`

- Use `--container-options` to define the memory and cpu for the container. We will also need to config docker desktop to allow more memory and cpu for containers. `top-right-corner-gear-icon` -> Resources -> Advanced -> Memory: 16.0 GiB, CPUs: 8`

:::

## Run the github action locally

```bash
act -W .github/workflows/<workflow-name>.yml
```

:::tip
Here is a very simple git action workflow .yml file:

```yml
name: Unit Test

on:
  pull_request:
    types:
      - opened
      - reopened
      - synchronize
  push:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 30 # default is 360 minutes

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies & build project
        run: |
          npm cache clean --force
          rm -rf node_modules
          npm install
          npm run build

      - name: Run Node tests
        run: npm run test:node
```

:::
