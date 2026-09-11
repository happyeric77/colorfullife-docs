---
title: How a leftover kube-vip DaemonSet poisoned ARP and broke etcd quorum
description: A post-mortem of a cluster outage caused by a reverted VIP experiment, a stuck DaemonSet and a router ARP table with one MAC address for many IPs.
date: 2026-04-19
type: retrospective
project: home-lab-kubernetes
topics:
  - kubernetes
  - k3s
  - kube-vip
  - etcd
  - high-availability
  - networking
featured: false
---

This is the story of an outage that started as a small networking experiment
and ended with a control plane that could not maintain quorum. The lesson is
about ordering: reverting a Git change does not help if the component that
reads Git depends on the datastore that is already broken.

## The experiment

A three-node K3s control plane, all nodes on Wi-Fi at the time, already had a
virtual IP for the API server managed by kube-vip. The next step was to give
application ingress a virtual IP as well, using kube-vip's services mode. The
manifest was committed as a DaemonSet that would announce per-service `/32`
addresses.

It did not work as intended, and the change was reverted.

## The failure chain

1. The revert commit was pushed, but Flux could not delete the DaemonSet from
   the cluster: etcd quorum was already broken, so the GitOps reconciliation
   loop had nothing to read state from and nothing to write state to.
2. Because the object still existed in etcd, the kubelet on the node
   recreated the pod — as kubelets do — even though the DaemonSet had been
   removed from Git.
3. The recreated pod announced its `/32` service addresses on the wireless
   interface.
4. Wi-Fi is a shared medium. The access point's ARP table learned one MAC
   address for many IP addresses, a poisoned entry that then spread.
5. etcd peer traffic on port 2380 could no longer resolve its peers: ARP for
   the node addresses failed or returned the wrong destination.
6. Quorum collapsed, which kept Flux unable to remove the object, which kept
   the pod alive. A loop.

## Diagnosis

The clues were unusually confusing:

- The wrong primary address was showing on the wireless interface.
- An SSH session to one node would sometimes land on a different one.
- mDNS names still resolved, which made the network look healthy.
- The one reliable vantage point was a machine outside the affected segment;
  from there the pattern was obvious.

## Recovery

Order is everything here. The goal is to stop the thing that keeps making
things worse before repairing the datastore.

1. Stop K3s on all nodes and remove the stray `/32` addresses from the
   interfaces they were announced on.
2. On one control-plane node, run a single-node cluster reset
   (`k3s server --cluster-reset`) so the datastore can be opened again.
3. Start K3s on that node and delete the offending DaemonSet.
4. On each of the other control-plane nodes, wipe **both**:
   - `/var/lib/rancher/k3s/server/db/etcd`
   - `/var/lib/rancher/k3s/server/tls/etcd`

   Deleting only the datastore is not enough — the etcd certificates have to
   go too, or the peer handshake fails against the reset member. This detail
   cost the most time.
5. Restart K3s on each node and let them rejoin, then clean up the leftover
   static pods with `crictl stop` / `crictl rm`.

## Prevention

- Do not run kube-vip in services mode on a Wi-Fi network. Announcements that
  rely on gratuitous ARP only update the router; Wi-Fi peers can miss them.
- Use MetalLB or a static LoadBalancer address instead.
- Take an etcd snapshot before any kube-vip change.
- Understand that a GitOps revert is not an escape hatch: if the datastore is
  down, the revert cannot be applied. Recovery has to be manual first,
  declarative second.
- On a three-member etcd cluster, protect quorum above all else. One node can
  fail; the second failure is the outage.

## Takeaways

The experiment was reverted. The pod was not. The datastore held the state
that kept the pod alive, and the pod was the reason the datastore could not
recover. Breaking that loop meant going to the nodes and fixing etcd by hand,
in the right order, before Git could take over again.
