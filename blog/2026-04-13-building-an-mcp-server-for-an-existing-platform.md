---
title: Building an MCP server for an existing platform
description: Turning an existing platform API into something an AI agent can use — the design decisions behind a small, local-first MCP server.
date: 2026-04-13
type: project-story
project: ai-dev-tools
topics:
  - mcp
  - typescript
  - developer-tools
  - ai
featured: false
---

A platform with a mature API is not automatically usable by an AI agent. Agents
need tools with names, schemas and boundaries they can reason about — and a way
to run them without handing credentials to a stranger. This is the story of
adding that layer to an existing notification platform.

## The goal

The platform already had everything a notification product needs: tenant
configuration, alert subscriptions, message publishing, and SDKs for web and
server environments. What it did not have was an interface an agent could
operate.

The target workflows were concrete:

- an agent detects a large on-chain transaction and notifies subscribed wallets
- a liquidation warning goes out before a position is at risk
- a community manager drafts and broadcasts an announcement
- a developer asks an AI IDE to publish a test notification

Non-agent workflows still had the raw GraphQL and REST APIs. The new layer was
for autonomy.

## Decisions before code

Nine decisions shaped the implementation. The important ones:

**MCP and a companion skill.** MCP is the runtime integration: it gives the
agent executable tools. A companion skill is the guidance layer: when to use
which tool, how to reason about payloads, and when to ask the user instead of
guessing. Tools alone are not enough for a domain with tenant-specific data
shapes.

**Local-first, stdio only.** The server is distributed as an npm package the
user runs themselves. Credentials live in environment variables on the user's
machine and never leave it. No hosted infrastructure, no SSE transport, no
OAuth flow to build.

**Exactly three tools.** `publish_message`, `get_active_alerts` and
`get_tenant_config`. A small surface is a feature: agents select tools more
reliably from a short list, and every tool is a commitment to maintain.

**Raw payloads, no universal schema.** The payload for a message is defined by
tenant, topic and template, so the server passes it through as an object rather
than inventing an abstraction that would be wrong half the time.

**No package installation.** The agent may only use the predefined tools or
documented direct API calls. It must not install or execute arbitrary packages
— a whitelist keeps the blast radius small.

## The architecture

```text
AI agent
   │  stdio
   ▼
local MCP server  ──HTTPS──▶  platform GraphQL + REST APIs
   │
   └── reuses the existing server-side SDK
```

The server is a thin wrapper over the platform's Node SDK: it reuses the
GraphQL and REST clients instead of reimplementing them. Configuration comes
from environment variables, the client is initialized lazily on the first tool
call, and token refresh is handled transparently.

## What the tools look like

`get_tenant_config` returns the tenant's configuration and its events with
metadata — the information an agent needs to reason about everything else.

`get_active_alerts` returns the subscribers currently subscribed to an event,
with cursor pagination normalized into a simple page object.

`publish_message` takes an event id, the raw payload object and an optional
wallet target list. It maps the target list onto the API's wallet-specific send
path and passes the payload through unchanged.

## The part that is not code

The hardest part is payload reasoning. A tenant's topic might require a field
that exists nowhere in the metadata. There is no universal function from
"event" to "valid payload" — the knowledge lives in the tenant's configuration
and sometimes only in the head of the person asking.

That is what the companion skill is for. It teaches the agent to inspect the
configuration first, to prefer the MCP path, to fall back to documented direct
API calls when MCP is unavailable, and — most importantly — to ask the user
when the required shape is ambiguous.

## Validation in a real agent

The server passed its unit-level checks, but the interesting validation was end
to end, inside an actual agent runtime:

- the server boots, and a missing credential produces an actionable error
  instead of a crash
- the agent discovers the tools and the companion skill
- configuration lookup, alert pagination and a real broadcast publish all
  succeed
- given an ambiguous payload, the agent inspects the configuration before
  assuming a shape
- when MCP is unavailable, the agent can still explain the direct API path

That last set of scenarios is where the design is really tested. A tool server
is easy to demo and hard to make dependable.

## What I would keep

- **Small tool surfaces.** Three well-named tools beat fifteen convenient ones.
- **Pass-through payloads.** Abstractions over data shapes you do not control
  become translation layers you cannot maintain.
- **Local-first credentials.** It removes an entire class of security review.
- **A companion skill.** The agent needs judgment about the domain, not just a
  list of functions.
