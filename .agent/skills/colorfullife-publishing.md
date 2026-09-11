# ColorfulLife Docs publishing skill

Instructions for agents publishing engineering content to this repository.
The content model below is canonical: do not invent new content types, routes
or metadata fields.

## Core model

| Concept   | Question it answers                        | Lives in                     |
| --------- | ------------------------------------------ | ---------------------------- |
| Project   | What do I build?                           | `projects/*.mdx`             |
| Journal   | What happened while building it?           | `blog/*.md(x)`               |
| Topics    | Which technologies/concepts cross both?    | front matter metadata only   |
| Archive   | What did I write down before this model?   | `docs/` (legacy, do not grow) |

- **Project** = what I build
- **Journal** = stories from the work
- **Topics** = cross-project discovery
- **Archive** = legacy reference material

Relationships:

```text
Project.id            ← Journal.project
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

Only create a Project when the thing has:

- its own story
- its own lifecycle
- the potential to produce multiple future Journal entries
- enough substance to deserve its own URL

Example:

```text
Home Lab       → Project
K3s Cluster    → Subproject (parentProject: home-lab)
Home Assistant → Subproject (parentProject: home-lab)
Grafana        → Component by default
Prometheus     → Component by default
Kubernetes     → Topic
```

A component lives inside its parent Project's page or Journal entries. It can
be promoted to a Project later if it grows a story and lifecycle.

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

### ProjectType

`type` answers: what is this Project, essentially? It drives badges, filtering
and grouping — never the layout.

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

## Journal metadata

Files live in `blog/`, named `YYYY-MM-DD-slug.md(x)`, and are published at
`/journal`. The public name is always **Journal**, never Blog.

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
collections.

### JournalType

`type` answers: in what form does this entry tell the story? Allowed values:
`project-story`, `build-log`, `deep-dive`, `retrospective`, `field-note`.

JournalType and ProjectType are separate vocabularies. Never mix them.

## Topic naming rules

- Topics are lowercase kebab-case slugs: `kubernetes`, `gitops`,
  `home-automation`, `self-hosting`, `argocd`.
- Uppercase or alias variants (`Kubernetes`, `k8s`, `K8S`) are rejected at
  build time — one canonical slug per concept.
- Display labels may differ from the slug via the `TOPIC_LABELS` map in
  `plugins/content-model/index.js` (`k3s → K3s`, `argocd → Argo CD`).
- Do not repeat the ProjectType as a Topic unless there is a real reason:

  ```yaml
  type: infrastructure
  topics:
    - infrastructure # avoid
  ```

## Agent publishing workflow

When asked to publish engineering content:

1. Find the existing Project the content belongs to.
2. Decide whether a new Project is actually needed (see the rule above).
3. Add or update the Project page in `projects/`.
4. Add a Journal entry in `blog/`.
5. Point `Journal.project` at the Project `id`.
6. Add canonical lowercase Topic slugs to `topics`.
7. Do not create or update topic article lists by hand.
8. Run validation:

   ```bash
   npm run typecheck
   npm test
   npm run build
   ```

9. Verify the relationships: the Journal page renders under `/journal`, the
   Project page under `/projects`, and the Topics appear on `/topics`.

Build-time validation rejects duplicate project ids, unknown `project` /
`parentProject` references, hierarchy cycles, invalid type/status values and
invalid topic slugs.
