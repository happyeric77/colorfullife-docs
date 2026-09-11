# ColorfulLife Docs

An engineering journal and project portfolio. Deployed at
[https://docs.colorfullife.ml](https://docs.colorfullife.ml).

## Content model

| System       | Route       | Source      | What it is                                      |
| ------------ | ----------- | ----------- | ----------------------------------------------- |
| Homepage     | `/`         | `src/pages` | Shell: current project, recent journal, topics  |
| Projects     | `/projects` | `projects/` | Curated, durable canonical pages for selected work |
| Journal      | `/journal`  | `blog/`     | Primary publishing stream: stories from real work |
| Topics       | `/topics`   | metadata    | Cross-project technologies and concepts         |
| Open Source  | `/opensource` | `src/pages` | GitHub activity, placeholder for now          |
| Archive      | `/archive`  | `docs/`     | Legacy technical notes, kept for reference      |
| About        | `/about`    | `src/pages` | About the site                                  |

Projects, Journal entries and Topics are aggregated at build time by
`plugins/content-model/index.js` and exposed to React via
`useContentModel()` (`src/lib/content-model.js`).

## Publishing conventions

The canonical guide for content metadata is the
[`engineering-publishing` skill](.opencode/skills/engineering-publishing/SKILL.md).
Short version:

- **Project** (`projects/*.mdx`) — a curated, durable canonical page for work
  that is worth understanding standalone. Core front matter: `id`, `title`,
  `description`, `type`, `status`, `topics`.
- **Journal** (`blog/*.md(x)`) — the primary publishing stream: a dated story
  from real work. Core front matter: `title`, `description`, `date`, `type`,
  `topics`; optional: `project`, `featured`.
- **Topics** — lowercase kebab-case slugs shared by both; `/topics` is
  aggregated automatically. They are not content types or categories.
- **Archive** (`docs/`) — legacy reference notes; do not extend.

Project front matter:

```yaml
id: home-lab-kubernetes
title: Kubernetes Home Lab
description: "..."
type: infrastructure # project | product | service | system | infrastructure | open-source | experiment
status: running # active | running | completed | paused | archived
# parentProject: home-lab # optional; must match another project id
started: 2022
featured: true
topics: [kubernetes, gitops, fluxcd]
stack: [K3s, Flux CD]
```

Journal front matter:

```yaml
title: "..."
description: "..."
date: 2026-09-11
type: build-log # project-story | build-log | deep-dive | retrospective | field-note
project: colorfullife-docs # optional; when present must match a project id
topics: [docusaurus, information-architecture]
featured: false
```

Journal entries may optionally reference a Project when that relationship adds
useful context. A Journal without a `project` is valid and still appears in
`/journal` and in its Topics.

`type` is a controlled vocabulary, `status` is the current state only, and
project history belongs in the Journal timeline — see the guide for the full
rules and the agent publishing workflow.

A service is only a Project/Subproject if it has its own story and lifecycle;
complexity alone does not make something a Project. Otherwise it is a
component of the project that contains it (Grafana is a component of the
Kubernetes Home Lab).

## Local development

```bash
npm install
npm start
```

Validation (routing, links and metadata relationships must all pass):

```bash
npm run typecheck
npm test
npm run build
npm run serve
```

## Not yet included

Visual redesign, full project hierarchy UI, complete topic aggregation and
Open Source automation are follow-up work.
