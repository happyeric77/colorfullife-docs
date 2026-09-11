---
name: engineering-publishing
description: Use when adding, editing, organizing, or reviewing Projects, Journal entries, Topics metadata, or other published engineering content in this repository. Defines the content model, metadata relationships, Project-vs-Component rules, topic conventions, and publishing validation workflow.
compatibility: opencode
---

# Engineering publishing

Instructions for agents publishing engineering content to this repository.
The content model below is canonical: do not invent new content types, routes
or metadata fields.

This skill covers publishing content only. General coding, UI, CSS,
dependency and infrastructure changes are out of scope.

## Core model

| Concept | Question it answers                     | Lives in                     |
| ------- | --------------------------------------- | ---------------------------- |
| Project | What do I build?                        | `projects/*.mdx`             |
| Journal | What happened while building it?        | `blog/*.md(x)`               |
| Topics  | Which technologies/concepts cross both? | front matter metadata only   |
| Archive | What did I write down before this model?| `docs/` (legacy, do not grow)|

- **Project** = a long-lived engineering entity that deserves a canonical page.
- **Journal** = a story, event, decision or retrospective that came out of
  real engineering work.
- **Topics** = the shared cross-content index of technologies, concepts and
  domains for Projects and Journal entries.
- **Archive** = legacy reference notes, not part of the publishing model.

Relationships:

```text
Journal.project       → Project.id
Project.parentProject → Project.id
Project.topics        → Topic slugs
Journal.topics        → Topic slugs
```

## Source of truth

Maintain only:

```text
projects/*.mdx
blog/*.md(x)
```

Every other surface (`/`, `/projects`, `/topics`, journal sidebars) is
aggregated from this metadata at build time by `plugins/content-model/`.
Never copy an article into another folder. Never hand-maintain a topic
article list.

## Decision tree

```text
Is this a long-lived public thing?
    Yes → Project

Is this a meaningful event/story from real work?
    Yes → Journal

Is this only a technology/concept?
    → Topic (front matter slug, no page to write)

Is this only an implementation component?
    → keep it inside the parent Project
```

## Project vs Component rule

Do not turn every service into a Project. Only create a Project when the
thing has:

- its own story
- long-term evolution
- its own lifecycle/history
- the potential to produce multiple future Journal entries
- enough substance to deserve its own URL

Example:

```text
Home Lab       → Project
K3s Cluster    → Project / child Project (parentProject: home-lab)
Home Assistant → Project / child Project (parentProject: home-lab)
Grafana        → Component by default
Prometheus     → Component by default
Argo CD        → Component by default
Kubernetes     → Topic
GitOps         → Topic
```

A component lives inside its parent Project's page or Journal entries. It can
be promoted to a Project later if it grows a story and lifecycle. Do not
pre-build the whole infrastructure inventory as Projects.

## Project metadata

Core fields: `id`, `title`, `description`, `type`, `status`, `topics`.
Optional fields: `parentProject`, `started`, `featured`, `stack`, `github`,
`website`.

```yaml
id: home-lab-k3s
title: K3s Cluster
description: Lightweight Kubernetes infrastructure for my home services.

type: infrastructure
status: running

parentProject: home-lab

started: 2026-01
featured: true

topics:
  - kubernetes
  - k3s
  - gitops
  - self-hosting

stack:
  - K3s
  - Argo CD
  - Longhorn

github:
website:
```

Do not add new metadata fields ad hoc. If a new field seems necessary, check
`plugins/content-model/`, the README and existing content first, and confirm
it is an architecture-level requirement rather than a per-article
convenience.

### ProjectType

`type` answers: what is this Project, essentially? It drives badges, filtering
and grouping — never the layout of the page.

Allowed values: `project`, `product`, `service`, `system`, `infrastructure`,
`open-source`, `experiment`.

Do not use technology names as ProjectType. Kubernetes is a Topic:

```yaml
# wrong
type: kubernetes

# right
type: infrastructure
topics:
  - kubernetes
```

### Status vs lifecycle

`status` answers: what state is it in now? Allowed values: `active`,
`running`, `completed`, `paused`, `archived`.

There is no separate lifecycle schema. A Project's history is told by its
Journal timeline:

```text
2025-01  Project Story   Started the first Home Lab setup
2025-08  Build Log       Migrated from Docker Compose to K3s
2026-02  Retrospective   Six months running K3s at home
```

`status` = current state. Journal = lifecycle and history. Do not build a
state machine.

## Journal

Journal files live in `blog/`, named `YYYY-MM-DD-slug.md(x)`, and are
published at `/journal`. The public name is always **Journal**, never Blog.
Even though the site is built on the Docusaurus blog plugin, do not call this
the Blog content model in public content or repository conventions.

```yaml
title: Rebuilding my K3s cluster around GitOps
description: Moving my home cluster deployment workflow to GitOps.
date: 2026-09-20

type: build-log

project: home-lab-k3s

topics:
  - kubernetes
  - k3s
  - gitops
  - argocd

featured: false
```

`project` must match a Project `id`. That is the only link between the two
collections. When a clear Project exists, always set one primary `project`.
Never create a Project relationship by copying an article.

### JournalType

`type` answers: in what form does this entry tell the story? Allowed values:

```text
project-story → a Project's context, problem, solution and result
build-log     → implementation, milestone, migration or design decision
deep-dive     → a technical problem explored from real Project context
retrospective → a look back at a stretch of engineering work and lessons learned
field-note    → a smaller but publishable practical observation
```

JournalType and ProjectType are separate vocabularies. Never mix them.

## Topics

Topics answer: which technologies, concepts or engineering domains does this
Project or Journal touch? Both content types can carry multiple topics, so
Topics are a many-to-many cross-content relationship:

```text
Kubernetes

Projects
├── Home Lab → K3s Cluster
└── SaaS → Infrastructure

Journal
├── Rebuilding K3s around GitOps
└── Running SaaS workers on Kubernetes
```

These relationships are aggregated from metadata automatically. Do not create
or maintain topic article lists by hand.

### Topic convention

- Topics are canonical lowercase kebab-case slugs: `kubernetes`, `gitops`,
  `self-hosting`, `home-automation`, `argocd`.
- Uppercase or alias variants (`Kubernetes`, `k8s`, `K8S`) are rejected at
  build time — one canonical slug per concept. Before adding a topic, look
  for an existing canonical slug.
- Display labels may differ from the slug via the `TOPIC_LABELS` map in
  `plugins/content-model/index.js` (`k3s → K3s`, `argocd → Argo CD`). Do not
  change the metadata slug for display reasons.
- Do not repeat the ProjectType as a Topic unless there is a real reason:

  ```yaml
  type: infrastructure
  topics:
    - infrastructure # avoid
  ```

## Publishing workflow

When asked to publish engineering content:

1. Decide whether this updates an existing Project or adds a Journal entry.
2. Search for the existing Project the content belongs to.
3. Decide whether a new Project is actually needed (see the rule above).
4. Add or update the Project page in `projects/`.
5. Add a Journal entry in `blog/`.
6. Point `Journal.project` at the Project `id`.
7. Add canonical lowercase Topic slugs to `topics`.
8. Do not create or update topic article lists by hand.
9. Run validation:

   ```bash
   npm run typecheck
   npm test
   npm run build
   ```

10. Verify the relationships: the Journal page renders under `/journal`, the
    Project page under `/projects`, and the Topics appear on `/topics`.

## Validation failures

The content model validates at build time and rejects:

- duplicate Project IDs
- invalid Journal → Project references
- invalid `parentProject` references
- Project hierarchy cycles
- invalid ProjectType
- invalid JournalType
- invalid Project status
- invalid Topic slugs
- the stale `parent` field (renamed to `parentProject`)

Do not bypass these validations. If a validation failure comes from publishing
metadata, fix the content. Do not relax the validator to let invalid content
through.

## Archive

`docs/` (`/archive`) is legacy reference content. Do not add new Project or
Journal style engineering content to it. New engineering stories should be
classified as Project or Journal. Only modify the Archive for genuine legacy
or reference maintenance.
