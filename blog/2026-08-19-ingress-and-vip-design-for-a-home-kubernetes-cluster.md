---
title: Ingress and VIP design for a home Kubernetes cluster
description: How traffic reaches a small cluster from the internet and from the LAN, and why a single virtual IP is not the same as high availability.
date: 2026-08-19
type: deep-dive
project: home-lab-kubernetes
topics:
  - kubernetes
  - ingress
  - traefik
  - kube-vip
  - networking
featured: false
---

A home cluster serves two audiences: the public internet and devices on the
local network. Both paths eventually need to land on the ingress controller,
and both have their own failure modes. This is the design the cluster settled
on, and the part of it that is still weaker than it looks.

## The building blocks

- **Ingress controller**: Traefik, installed as the cluster's ingress, routing
  by hostname to Services.
- **LoadBalancer implementation**: Traefik is exposed through a Service of
  type `LoadBalancer`. With no cloud provider, something in the cluster has to
  implement that — either a LoadBalancer controller or a shared virtual IP.
- **API VIP**: kube-vip provides a virtual IP for the Kubernetes API server so
  the control plane has a stable address independent of which node is master.
- **External entry**: a tunnel daemon runs as a container and forwards public
  traffic to the ingress origin on the local network. Internal entry uses
  local DNS.

## What "LoadBalancer" actually means here

On a cloud provider, a `LoadBalancer` Service provisions a real balancer. On
bare metal it is whatever the implementation provides. In this cluster,
Traefik's LoadBalancer status lists **all node addresses** — the controller
lets any node accept and forward traffic for the service. That is convenient
and it is also easy to misread: the external address field is not a single
stable VIP you can point DNS at.

The API VIP is separate and intentionally so. If the application VIP and the
API VIP shared an address, a routing problem in one would take out the other.
An early attempt to give applications a managed VIP failed and was reverted
(see the
[post-mortem on the ARP fallout](/journal/2026/04/19/kube-vip-arp-pollution-and-etcd-quorum-collapse)).
The design keeps them apart while the application path is reworked.

## The two entry paths

```text
Internet → tunnel daemon → ingress origin → Traefik → Service → Pod
LAN      → local DNS     → node address   → Traefik → Service → Pod
```

The external path has one manual seam: the tunnel's origin address is
configured in the tunnel dashboard, not in Git. The internal path has a
different problem.

## The DNS single point of failure

Internal hostnames resolved through the local DNS server, and the wildcard
record pointed at **one node's address**. Every internal request that entered
the cluster went through that node first.

This is important to name correctly: the bottleneck is not Traefik. Traefik
can be reached on any node. The single point of failure is the DNS record.
If that node is down, internal clients cannot reach the cluster even though
the ingress path itself is healthy.

The intended topology is:

```text
local DNS → application VIP → Traefik → any node
```

Once an application VIP exists, the DNS record stops being a SPOF; the VIP
takes over that role, and the VIP is a single address by design — which means
it needs its own answer for what happens when its holder fails.

## Layers and what manages them

| Layer              | Mechanism              | Managed by          |
| ------------------ | ---------------------- | ------------------- |
| API endpoint       | kube-vip virtual IP    | cluster config      |
| Application entry  | Traefik LoadBalancer   | cluster manifests   |
| Public origin      | tunnel daemon          | external dashboard  |
| Internal names     | local DNS server       | DNS configuration   |
| Routing rules      | Ingress objects        | Git                 |

The pattern worth noticing: the pieces closest to the network edge are the
least declarative. The tunnel origin and the DNS records are infrastructure
state living outside Git, and they are exactly the pieces that are hardest to
reconstruct after an outage.

## Takeaways

- A `LoadBalancer` Service on bare metal is an implementation, not a cloud
  guarantee. Understand what backs it.
- Keep the API VIP and any application VIP separate.
- A DNS record pointing at a single node is a single point of failure even
  when the ingress controller is healthy.
- Inventory the manual seams — tunnel configuration, DNS records — before an
  incident forces you to.
