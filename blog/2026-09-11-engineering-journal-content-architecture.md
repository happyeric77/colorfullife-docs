---
title: 'Rebuilding the site as an engineering journal'
description: >-
  Why the site moved from one pile of technical notes to a Journal, Projects
  and Topics content model — and what the first architecture PR changed.
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
but it could not answer the question I actually care about: what happened
while I was building and running these things?

## The content model

The site is an engineering journal first. Three concepts:

- **Journal** — the primary publishing stream: dated stories produced by the
  work — build logs, deep dives, retrospectives, field notes.
- **Project** — a curated canonical hub for durable work that is worth
  understanding on its own. A Journal may reference one Project when it adds
  useful context, but a Journal does not need a Project.
- **Topics** — cross-content discovery. Kubernetes connects the cluster, the
  Home Lab and eventually the SaaS work.

The existing technical notes are not rewritten or deleted. They keep their
docs-style navigation under `/archive`, because reference material deserves a
reference UI.

## What changed in this PR

This is the architecture PR, not the design PR. It establishes:

1. Legacy docs moved to `/archive` while keeping their filesystem layout.
2. The blog plugin became the **Journal**, served at `/journal`.
3. A second docs instance became the **Projects** collection at `/projects`,
   with MDX project pages instead of hardcoded React objects.
4. Project front matter gained `parentProject`, `status`, `stack` and `topics`, so
   Project → child Project relationships are expressed in content.
5. A small content-model plugin aggregates projects, journal entries and
   topics at build time, which powers the homepage, the topic index and the
   project list.

## What is deliberately not here

No visual redesign, no full project hierarchy UI, no GitHub automation, no
content migration. Those are follow-up PRs. The goal was to prove the four
content systems can coexist:

```text
/archive   legacy reference notes
/projects  the durable hubs
/journal   the publishing stream
/topics    the cross-content index
```

If that holds, adding the next Journal entry — a SaaS build log, a new
experiment, another Kubernetes migration — is just new content, not another
information architecture change.
