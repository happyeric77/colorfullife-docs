---
title: Alerting on a small Kubernetes cluster
description: Prometheus decides that something is wrong; Alertmanager decides whether anyone hears about it. The second part deserves as much design attention as the first.
date: 2026-01-31
type: deep-dive
project: home-lab-kubernetes
topics:
  - observability
  - prometheus
  - alertmanager
  - kubernetes
featured: false
---

A monitoring stack usually gets installed for its dashboards and then trusted
for its alerts. But an alert is a pipeline: a rule evaluates, a state
changes, a notification is routed, a person is interrupted. Every stage can
fail quietly. This is what that pipeline looks like in a small cluster and
where the sharp edges are.

## Two systems, two jobs

- **Prometheus** scrapes metrics, evaluates rules, and decides when an alert
  is firing.
- **Alertmanager** receives firing alerts and decides how to group, route,
  inhibit and deliver them.

Keeping the split in mind prevents a common confusion: a rule that never fires
and a notification that never arrives are different problems in different
systems.

## The life of an alert

```text
Inactive → Pending → Firing
```

A rule's expression becomes true, the alert enters `Pending`, and it stays
there until it has been continuously true for the rule's `for` duration. Only
then does it become `Firing` and get sent to Alertmanager. The `for` window is
the difference between "this spiked for one scrape" and "this is broken".

## Where the rules come from

The kube-prometheus-stack chart ships rule packs that can be toggled on and
off: application-level rules, node rules, and so on. One toggle is worth
calling out — datastore rules are typically disabled by default because
managed Kubernetes distributions own the datastore, and enabling the rules
without the matching metrics only produces confusion.

To see what is actually installed:

```bash
kubectl get prometheusrules
kubectl get prometheusrule <name> -o yaml
```

The object YAML is the ground truth: the expression, the threshold and the
`for` duration. Reading the live state is the Prometheus UI's **Alerts**
page, which shows each rule as inactive, pending or firing with the current
value.

A representative rule looks like this — a pod stuck in a crash loop:

```yaml
alert: KubePodCrashLooping
expr: max_over_time(kube_pod_container_status_waiting_reason{reason="CrashLoopBackOff"}[5m]) >= 1
for: 15m
labels:
  severity: warning
```

## Know which metrics you actually have

Two exporters carry very different information:

- **kube-state-metrics** reports the state of API objects: how many replicas a
  deployment wants, whether a pod is waiting, and why.
- **cAdvisor** reports container resource usage: CPU, memory, filesystem.

If cAdvisor is dropped to save resources — a reasonable choice on weak
hardware — the object-level rules keep working, but every rule that depends on
container memory or CPU silently has no data. Nothing breaks; the alert just
never fires. Worth writing down at install time.

## Grouping, timing and silencing

Alertmanager's routing tree decides where alerts go; grouping decides how many
messages a person receives. A crash-looping app with a bad replica count can
produce several alerts at once, and `group_by` collapses them:

```yaml
group_by: [namespace, alertname, severity]
```

Group too little and the phone buzzes per pod. Group too much and unrelated
problems arrive glued together. The timing knobs are:

- `group_wait` — how long to collect alerts before sending the first message.
- `group_interval` — how often to send updates about an existing group.
- `repeat_interval` — how often a still-firing alert is repeated.

**Silences** are the maintenance tool: a time-boxed mute that expires on its
own. They are better than editing rules for planned work, but a silence that
is too broad hides new problems inside its scope.

## The blind spot: whitebox without blackbox

Most of this stack is **whitebox** monitoring — it reports from inside the
system. Pods say they are running, services say they exist. What it cannot
tell you is whether a user can reach anything.

The classic gap: the ingress is broken, every pod is healthy, and Prometheus
is happy. The cluster is "green" and the site is down.

**Blackbox** probing closes this: probe the important endpoints from outside
on a schedule and alert when the response is wrong. If only one thing is added
after the initial setup, this is the one with the highest return.

## Recording rules

On a small cluster, dashboards that recompute expensive expressions on every
load can cost more than the monitoring is worth. Recording rules precompute an
expression into a new metric:

```yaml
record: job:request_rate:5m
expr: sum(rate(http_requests_total[5m])) by (job)
```

The dashboard then reads a cheap series. This matters most on low-power
hardware, where a heavy query is competing with the workload it observes.

## Takeaways

- A firing rule and a delivered notification are separate systems; design and
  test both.
- Know which metrics are absent before trusting an alert to cover something.
- Use `for` durations to filter noise, and group intentionally.
- Whitebox monitoring cannot see broken entry paths. Add a blackbox probe.
- On weak hardware, recording rules are a performance feature, not a luxury.
