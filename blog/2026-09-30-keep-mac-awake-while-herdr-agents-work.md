---
title: Preventing macOS sleep while Herdr agents are working
description: A zero-dependency Herdr plugin that keeps caffeinate alive while any agent pane is working — and deliberately lets the Mac sleep when an agent is blocked.
date: 2026-09-30
type: build-log
project: ai-dev-tools
topics:
  - ai
  - agents
  - developer-tools
featured: false
---

I run agents that take 40 minutes. I am not staring at a terminal for
40 minutes — but macOS does not know that, and it will happily put the
machine to sleep mid-run. `agent-keep-awake` is the smallest possible
fix: a Herdr plugin, zero npm dependencies, that keeps the Mac awake
exactly while agents are working and not a minute longer.

## How it works

A startup hook spawns a small daemon. Every 15 seconds the daemon runs
`herdr pane list`, and if **any** pane reports `agent_status: working`
it keeps `caffeinate -i -s -d` alive — preventing system sleep and
keeping the display on. When no agent is working, `caffeinate` is
stopped and the Mac may sleep again.

The deliberate part: `blocked` panes are ignored. A blocked agent means
it is waiting on you, which means you should be coming back. Keeping
the machine awake for an agent that is stuck on a question would just
burn battery while nobody benefits.

## Configuration without ceremony

Everything lives in a `.env` under the plugin config dir:

| Variable | Default | Description |
|---|---|---|
| `KEEP_AWAKE_ENABLED` | `1` | Master on/off switch |
| `KEEP_AWAKE_POLL_INTERVAL` | `15` | Poll interval in seconds |
| `KEEP_AWAKE_DISPLAY` | `1` | Keep the display on too; `0` saves battery |

The toggle is `prefix+a`, with state in a plain text file you can `cat`.
No database, no config UI. Sometimes the best UX is a file.

## Honest limitations

macOS ignores `caffeinate -s` on battery power — only idle sleep is
prevented, which is an Apple design decision, not a bug in the plugin.
Closing the lid forces sleep regardless. And the daemon only sees the
agent status Herdr reports; it cannot detect in-flight work that Herdr
still considers idle.

This is part one of a Herdr utility series. Part two,
`agent-webhook-notify`, answers the other half of the problem: knowing
when the agent finished — or got blocked — without watching the
terminal.
