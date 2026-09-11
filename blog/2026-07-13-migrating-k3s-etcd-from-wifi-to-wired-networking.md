---
title: Migrating a K3s etcd cluster from Wi-Fi to wired networking
description: Moving a three-node control plane off Wi-Fi to eliminate etcd peer timeouts and restore a stable quorum.
date: 2026-07-13
type: build-log
project: home-lab-kubernetes
topics:
  - kubernetes
  - k3s
  - etcd
  - high-availability
  - networking
featured: false
---

The small Kubernetes cluster at home started life on Wi-Fi. The nodes were
spread across rooms, wireless was good enough for light workloads, and running
a cable to every control plane felt like unnecessary work. That held up for a
while — until the etcd members started complaining.

## The symptom

The cluster has three control-plane nodes running embedded etcd for
high availability. Over time the logs filled with etcd peer timeouts, the
API server slowed down, and leader elections started flapping. Under load the
whole control plane became briefly unavailable.

The first reaction was tuning. Raising the etcd heartbeat interval and
election timeout (`heartbeat-interval=500`, `election-timeout=5000`) made the
errors less frequent, which was enough to call the problem solved for a
while. It was not a fix: it only made etcd more forgiving of a network that
should never have been carrying peer traffic in the first place.

etcd is unusually sensitive to latency and jitter between members. Wireless
is exactly that: retries, roaming, and interference that show up as
milliseconds of variance at the worst possible moment.

## The fix: wire the control planes

All three control-plane nodes were moved to wired Ethernet (`eth0`). The
worker nodes did not need to change — etcd peers are the strict requirement,
not every workload.

The wireless interfaces were kept as backups with a higher route metric, so a
cable failure does not take a node off the network.

### Migrating one etcd member

The migration is a per-node procedure, and the ordering matters:

1. Confirm the node's new wired address.
2. Install `etcdctl` on **every** control-plane node. K3s does not bundle it,
   and it has to be reinstalled after a node is reprovisioned.
3. From a healthy member, list the cluster and update the peer URL:

   ```bash
   etcdctl member list
   etcdctl member update <member-id> \
     --peer-urls=https://<new-address>:2380
   ```

   The certificates live under
   `/var/lib/rancher/k3s/server/tls/etcd/` (`server-ca.crt`, `client.crt`,
   `client.key`).

4. Update `/etc/rancher/k3s/config.yaml` on that node with the new
   `node-ip` and `advertise-address`.
5. Restart K3s on the node.
6. Verify: the node is `Ready`, `etcdctl member list` shows the new peer URL,
   and the node annotations point at the wired address.

### The caveat that almost broke quorum

If the node being migrated is the **only healthy member**, it cannot rejoin
on a new peer URL that the other members do not know about yet. The safe
sequence is to boot it on the old address first, let quorum recover, then
update the peer URL and restart.

Losing quorum mid-migration is the failure mode to design around: on a
three-member cluster, one member can be offline at a time, and no more.

### kube-vip

The virtual IP for the API server is managed by kube-vip, which had been
configured against the wireless interface. That was switched to `eth0` as
part of the migration. The gratuitous-ARP workarounds that had accumulated
while the control planes were on Wi-Fi — needed because wireless clients can
miss ARP updates — are no longer required.

## What is not managed declaratively

Node-level changes — `/etc/rancher/k3s/config.yaml`, the `etcdctl` binary,
etcd member peer URLs — are outside GitOps. The cluster's workloads are
reconciled from Git, but the datastore identity of each control-plane node is
manual state. After this migration those details are worth recording
somewhere, because the next person to touch the cluster will need them.

## Takeaways

- etcd peer traffic belongs on a wired link. Tuning timeouts buys time, not
  stability.
- Install `etcdctl` on every control-plane node before you need it.
- On a three-node control plane, migrate one member at a time and never lose
  two.
- Keep the wireless interface as a backup with a higher metric instead of
  deleting it.
