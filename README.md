# ColorfulLife Docs

A project-first engineering journal. Deployed at
[https://docs.colorfullife.ml](https://docs.colorfullife.ml).

## Content model

| System       | Route       | Source      | What it is                                      |
| ------------ | ----------- | ----------- | ----------------------------------------------- |
| Homepage     | `/`         | `src/pages` | Shell: current project, recent journal, topics  |
| Projects     | `/projects` | `projects/` | Entities I build and maintain, incl. subprojects |
| Journal      | `/journal`  | `blog/`     | Dated stories from the work                     |
| Topics       | `/topics`   | metadata    | Cross-project technologies and concepts         |
| Open Source  | `/opensource` | `src/pages` | GitHub activity, placeholder for now          |
| Archive      | `/archive`  | `docs/`     | Legacy technical notes, kept for reference      |
| About        | `/about`    | `src/pages` | About the site                                  |

Projects, Journal entries and Topics are aggregated at build time by
`plugins/content-model/index.js` and exposed to React via
`useContentModel()` (`src/lib/content-model.js`).

## Content conventions

A **Project** is an MDX file in `projects/`. It needs front matter with at
least an `id`; files without an `id` are treated as index pages, not projects.

```yaml
id: home-lab-k3s
title: K3s Cluster
description: "..."
type: subproject # personal-project | subproject | ...
status: active # active | paused | archived
parent: home-lab # optional, points at another project id
started: 2022
featured: true
topics: [kubernetes, gitops]
stack: [K3s, Argo CD]
github: "https://github.com/..."
website: "https://..."
```

A **Journal** entry is a flat markdown file in `blog/`, named
`YYYY-MM-DD-slug.md(x)`.

```yaml
title: "..."
description: "..."
date: 2026-09-11
type: build-log # project-story | build-log | deep-dive | retrospective | field-note
project: colorfullife-docs # one primary project id
topics: [docusaurus, information-architecture]
featured: false
```

**Topics** are shared slugs: the same string in a project's `topics` and a
journal entry's `topics` connects them. Use lowercase kebab-case. Do not make
technologies into categories.

A service is only a Project/Subproject if it has its own story and lifecycle;
otherwise it is a component of the project that contains it (Grafana is a
component of the K3s Cluster).

## Local development

```bash
npm install
npm start
```

Production build (this is the check that matters for routing and links):

```bash
npm run build
npm run serve
```

## Not yet included

Visual redesign, full project hierarchy UI, complete topic aggregation and
Open Source automation are follow-up work.
