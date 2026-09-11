---
title: 'Rebuilding ColorfulLife Docs as a project-first journal'
description: >-
  Why the site moved from one pile of technical notes to Projects, Journal and
  Topics — and what the first architecture PR changed.
date: 2026-09-11
type: build-log
project: colorfullife-docs
topics:
  - docusaurus
  - information-architecture
featured: false
---

The original ColorfulLife Docs was a single Docusaurus docs tree. Every note —
Docusaurus tricks, Kubernetes commands, Home Lab fixes — was a page in the
same sidebar, with no idea of *what it came from*. It worked as a reference,
but it could not answer the question I actually care about: what am I
building, and what happened while building it?

## The content model

The rebuild is project-first. Three concepts:

- **Project** — what I build and maintain. An entity with a lifecycle.
- **Journal** — dated stories produced by the work: build logs, deep dives,
  retrospectives, field notes.
- **Topics** — cross-project discovery. Kubernetes connects the K3s cluster,
  the Home Lab and eventually the SaaS work.

The existing technical notes are not rewritten or deleted. They keep their
docs-style navigation under `/archive`, because reference material deserves a
reference UI.

## What changed in this PR

This is the architecture PR, not the design PR. It establishes:

1. Legacy docs moved to `/archive` while keeping their filesystem layout.
2. The blog plugin became the **Journal**, served at `/journal`.
3. A second docs instance became the **Projects** collection at `/projects`,
   with MDX project pages instead of hardcoded React objects.
4. Project front matter gained `parent`, `status`, `stack` and `topics`, so the
   Home Lab → K3s Cluster hierarchy is expressed in content.
5. A small content-model plugin aggregates projects, journal entries and
   topics at build time, which powers the homepage, the topic index and the
   project list.

## What is deliberately not here

No visual redesign, no full project hierarchy UI, no GitHub automation, no
content migration. Those are follow-up PRs. The goal was to prove the four
content systems can coexist:

```text
/archive   legacy reference notes
/projects  the entities
/journal   the stories
/topics    the cross-project index
```

If that holds, adding the next project — a SaaS, a new subproject, another
Kubernetes migration — is just new content, not another information
architecture change.
