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

| Concept | Question it answers                    | Lives in                      |
| ------- | -------------------------------------- | ----------------------------- |
| Journal | What happened, what did I do, why, what broke, what did I learn? | `blog/*.md(x)` |
| Project | Is this durable work that deserves its own canonical page? | `projects/*.mdx` |
| Topics  | Which technologies/concepts connect this content to other content? | front matter metadata only |
| Archive | What was written before this model?    | `docs/` (legacy, do not grow) |

- **Journal** = the primary publishing stream: a publishable story, event,
  decision, investigation or retrospective from real engineering work.
- **Project** = optional durable context: a thing worth presenting through a
  long-lived canonical overview page. A Journal does not need a Project.
- **Topics** = the concepts and technologies that connect content across the
  site, on both Projects and Journal entries.
- **Archive** = legacy reference notes, not part of the publishing model.

Relationships:

```text
Journal.project?      → Project.id   (optional)
Project.parentProject? → Project.id  (optional, structural hint only)
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
Is there something from real engineering work worth publishing?
  ├─ Yes → Journal
  └─ No → normally do not publish as a new Journal

Does this Journal naturally belong to an existing Project?
  ├─ Yes → add project: <project-id>
  └─ No → leave project unset

Is there a durable thing that deserves its own canonical overview page?
  ├─ Yes → create/update Project
  └─ No → keep it as context/component/capability
```

A Journal must never be unpublishable because it lacks a Project.

## Project, capability and component

Do not turn every service into a Project. `Capability` is a conceptual
distinction, not a data model — there is no capability entity or route.

Example:

```text
Home Lab            → Project
K3s Cluster         → Project
GitOps Delivery     → capability (project page section by default)
Argo CD             → component
Observability       → capability (project page section by default)
Prometheus, Grafana → components
Storage, Longhorn   → capability, component
Networking          → capability
Kubernetes, GitOps  → Topics
```

Usually **not** Projects: GitOps Delivery, Observability, Storage,
Networking, Grafana, Prometheus, Argo CD. They can live as sections of a
Project page, as architecture areas, or as components.

Only create a Project when the thing has a durable identity and:

- its own overview page answers: what is it, why does it exist, what state
  is it in, what can it do, which stories relate to it
- long-term existence and evolution of its own
- the potential to accumulate multiple Journal entries
- it is still understandable detached from its parent

Most of these true → Project. Complexity alone does not make something a
Project, and a Project is not the container every Journal must belong to.

A capability can be promoted to a Project later if it becomes an independent
reusable system, has its own repository, is used across multiple Projects,
evolves long-term, or produces many independent Journal entries. Do not
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

parentProject: home-lab # optional structural hint, not the main site IA

started: 2026-01
featured: true

topics:
  - kubernetes
  - k3s
  - gitops
  - self-hosting

stack:
  - K3s
  - Flux CD
  - Longhorn

github:
website:
```

`parentProject` is an optional structural relationship between two Projects.
Use it sparingly: generally at most Project → child Project. Do not build
deep chains (Project → Cluster → Namespace → Deployment → Component); this is
not a CMDB.

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
2025-01  Journal   Started the first Home Lab setup
2025-08  Journal   Migrated from Docker Compose to K3s
2026-02  Journal   Six months running K3s at home
```

`status` = current state. Journal = history. Do not build a state machine.

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

project: home-lab-k3s # optional; when present must match a Project id

topics:
  - kubernetes
  - k3s
  - gitops
  - argocd

featured: false
```

`Journal.project` is optional. Set it only when a natural, existing Project
clearly provides useful context. When present it must match a Project `id`.
A Journal without a `project` is fully valid and still appears in `/journal`,
in the homepage Journal list and in its Topics. Never invent a Project solely
because a Journal entry needs somewhere to belong, and never create a Project
relationship by copying an article.

```yaml
# Valid: a field-note that does not belong to any Project yet
title: An unexpected TCP behavior in a container network
description: A short note on connection reuse that surprised me.
date: 2026-03-04

type: field-note

topics:
  - networking
  - tcp

featured: false
```

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

These relationships are aggregated from metadata automatically, including
Journal entries that have no `project`. Do not create or maintain topic
article lists by hand.

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

1. Identify the story, finding or information worth publishing.
2. Decide whether it is a Journal entry. If it comes from real engineering
   work and is worth sharing, it can be a Journal.
3. Search for an existing Project that is naturally related.
4. If an existing Project clearly provides useful context, set
   `Journal.project` to its id.
5. If no Project fits, leave `project` unset. That is a valid Journal.
6. Only create a new Project if the subject deserves its own long-lived
   canonical overview page (see the threshold above).
7. Add canonical lowercase Topic slugs to `topics`.
8. Never create a Project only to satisfy Journal metadata.
9. Do not create or update topic article lists by hand.
10. Run validation:

    ```bash
    npm run typecheck
    npm test
    npm run build
    ```

**Never invent a Project solely because a Journal entry needs somewhere to
belong.**

## Validation failures

The content model validates at build time and rejects:

- duplicate Project IDs
- invalid Journal → Project references (a missing `project` is fine; an
  unknown `project` id is not)
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
classified as Journal (and optionally linked to a Project). Only modify the
Archive for genuine legacy or reference maintenance.
