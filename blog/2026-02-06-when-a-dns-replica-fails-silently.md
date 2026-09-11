---
title: When a DNS replica fails silently
description: A redundant resolver was offline for a month, the sync job had been failing for longer, and the notification path was broken too. Nobody noticed.
date: 2026-02-06
type: field-note
topics:
  - dns
  - high-availability
  - monitoring
  - self-hosting
featured: false
---

The local network runs two DNS resolvers — a primary and a replica — kept in
sync so that either can answer queries. That is the shape of high
availability. What an audit found was that the replica had been offline for
about a month, the primary had been answering everything alone, and nothing
had said a word.

It kept going: the sync container's health check had failed tens of thousands
of times in a row, and the webhook that was supposed to report sync failures
had been returning 404 for longer still. Three independent problems, stacked
so neatly that each one hid the next.

## The layers that failed

```text
replica node down      → resolution still works (primary answers)
sync job failing       → no visible symptom (replica not serving)
notification broken    → failure report goes nowhere (webhook 404)
```

Any one of these being healthy would have surfaced the others. The
redundancy worked so well that the failure was invisible.

## What actual HA requires

- **Monitor the replica, not the service.** "DNS resolves" only proves that
  *a* resolver is up. A replica check has to ask the replica directly — a
  query against its own address, not the shared name.
- **Check the alert delivery path.** A notification channel is a dependency
  like any other. Stale webhooks, expired tokens and changed URLs all fail
  silently unless something tests them. A periodic test alert or a dead man's
  switch turns "nobody was told" into a detectable condition.
- **A failing health check must reach a human.** Repeatedly failing health
  checks that only appear in container logs are decoration.
- **Test failover.** Until the replica has actually served queries while the
  primary was down, "HA" is a hope. A planned failover test is the only proof.
- **Make rejoining automatic.** Firewall rules and reconnect configuration
  have to survive a reboot, or a restarted replica stays offline — which is
  exactly how a one-day outage becomes a month.

## The uncomfortable takeaway

The system did not fail because DNS stopped working. It failed because the
redundancy was never exercised, and the reporting chain had the same blind
spot as the thing it reported on. Redundancy without a test is just a second
copy of the same assumption.
