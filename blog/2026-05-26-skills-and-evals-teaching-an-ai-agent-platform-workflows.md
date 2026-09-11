---
title: "Skills and evals: teaching an AI agent platform workflows"
description: What it takes to make an AI coding agent reliably integrate a platform — a workflow skill, a real codebase as a fixture, and a human-graded evaluation loop.
date: 2026-05-26
type: deep-dive
project: ai-dev-tools
topics:
  - ai
  - developer-tools
  - evals
  - agents
featured: false
---

Giving an agent tools is the easy part. Making it follow your platform's
integration workflow — correctly, on a real codebase, without rewriting the app
around it — is where the work is.

## A skill is a workflow, not a README

The first instinct is to hand the agent the documentation. That fails for a
predictable reason: documentation describes the API, but integration is a
sequence of decisions.

The skill we wrote encodes that sequence:

- **Choose the path.** Drop-in card, custom UI through context hooks, or an
  action-link flow.
- **Choose the authentication mode.** On-chain wallet signing, off-chain
  sign-in, or a special case.
- **Confirm the inputs.** Tenant id, card id, environment, wallet chain, keys,
  signing method. If something is missing, ask — do not guess.
- **Integrate minimally.** Fit the existing app structure; do not invent a new
  architecture around it.

It opens with a short decision tree, then goes straight to implementation.
Every section exists to remove a decision the agent would otherwise make
wrongly by default.

## The failure modes are the content

Half of the skill is a list of ways integrations go wrong: provider mounted in
the wrong place, auth mode mismatched with the wallet connection, subscription
values parsed without checking the shape they depend on. These are not API
errors — they are judgment errors. A skill is valuable exactly to the extent
that it prevents them.

## You cannot eyeball this

A skill that reads well can still make an agent worse. The only way to know is
to run it against a real task and compare.

The evaluation setup has four parts:

- **Evals** — the test cases: a prompt, the expected behavior, and what a
  reviewer should look at.
- **Fixtures** — an immutable baseline codebase to run against.
- **Workspaces** — the artifacts of each run: final response, transcript, diff,
  timing.
- **A runner** — the orchestration that clones the fixture, creates a
  workspace, launches the agent, and saves everything for review.

## Choices for the first iteration

**A real codebase, pinned.** The fixture is a real downstream React
application cloned at a fixed commit — not a toy example and not a vendored
snapshot. The agent has to work inside an app with its own wallet setup,
routing and conventions.

**With and without.** Every eval runs twice: once with the skill available,
once without. The difference between the runs is the signal.

**Human review first.** Grading is done by a person against a rubric, not by
assertions. The rubric scores seven things: path selection, auth mode, provider
placement, required parameters, preservation of the existing app, code
correctness, and minimality of the diff.

**Assets in Git, artifacts out.** The skill, eval definitions, rubric and
fixture metadata are committed. Run workspaces are gitignored — they are
evidence, not source.

## What we learned

- **Run the eval before trusting the skill.** The differences were subtle: the
  same integration wired two different ways, one of which would rot.
- **A pinned real codebase finds problems a synthetic one cannot.** It also
  forces the runner to be reproducible.
- **Human grading is the right MVP.** Automating a rubric before you know which
  dimensions matter freezes the wrong criteria.
- **Minimality is a scored dimension.** An agent that completes the task by
  rewriting half the app has failed.

The next steps are the obvious ones: more fixtures (an off-chain auth app),
automated graders once the rubric stabilizes, and benchmark aggregation across
iterations. But the order matters — skills, real fixtures, human review, and
only then automation.
