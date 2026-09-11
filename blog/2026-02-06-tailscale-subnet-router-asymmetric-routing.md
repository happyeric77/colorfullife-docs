---
title: Tailscale subnet routers and asymmetric routing on the home LAN
description: A LAN host became unreachable from its own network while still reachable over Tailscale. The cause was a subnet router advertising the very subnet it lived on.
date: 2026-02-06
type: deep-dive
project: home-lab-kubernetes
topics:
  - tailscale
  - networking
  - policy-routing
featured: false
---

## The symptom

A host on the home LAN became unreachable from other LAN devices. Every ping
and connection attempt failed, while the same host answered normally over its
Tailscale address. The router logged ICMP redirects toward the affected host
during the failures, which pointed at a routing disagreement rather than a
broken interface.

## How Tailscale subnet routers work

A subnet router advertises routes for a physical network into the tailnet, so
remote clients can reach that network without running Tailscale on every
device. Nodes that accept those routes install them in a separate routing
table and add a policy rule that sends matching traffic through the Tailscale
interface instead of the default route.

That design is what makes subnet routing convenient — and what makes overlaps
dangerous.

## Root cause

One host on the LAN was running Tailscale as a subnet router for the same
subnet it was connected to, with route acceptance enabled. Two facts combined:

- Inbound traffic reached the host over the LAN, as expected.
- Replies to that traffic matched the accepted-route rule and left through the
  Tailscale interface.

The return path no longer matched the request path. Requests arrived over
Ethernet, replies departed over the VPN, and the peer discarded the replies
because they never came back the way they went out. This is asymmetric
routing: every interface is up, every route looks plausible in isolation, and
traffic still disappears.

The detail that makes this nasty is that the host is the only one affected.
Other LAN devices route to it normally; the problem lives entirely in its
policy routing rules.

A useful contrast is how different systems ship: some appliance operating
systems install a high-priority rule that keeps local-network destinations in
the main routing table by default, while a plain general-purpose Linux install
does not. The same network, the same Tailscale settings, different failure
behavior — the protection rule is the difference.

## The fix

Keep traffic destined for the local subnet in the main routing table, with a
priority higher than the accepted-routes rule:

```bash
ip rule add from all to <lan-subnet> table main priority 5000
```

To survive reboots, persist it as a small systemd unit:

```ini
[Unit]
Description=Keep local subnet traffic in the main routing table
After=network-online.target tailscaled.service

[Service]
Type=oneshot
ExecStart=/usr/sbin/ip rule add from all to <lan-subnet> table main priority 5000
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
```

Verify by checking which table wins for a lookup toward another LAN host:

```bash
ip rule show
ip route get <lan-host> from <affected-host>
```

Before the fix, the lookup resolves through the Tailscale table; after it, the
main table matches first.

## Policy routing priorities

Linux evaluates policy routing rules in ascending priority order, and the
first match wins. The relevant neighborhood on a Tailscale node looks like
this:

| Priority | Rule                      | Purpose                                         |
| -------- | ------------------------- | ----------------------------------------------- |
| 0        | local                     | local addresses                                 |
| 5000     | local-network protection  | keeps LAN destinations in the main table        |
| 5210     | fwmark                    | Tailscale's own marked traffic                  |
| 5270     | table 52                  | routes accepted from subnet routers             |
| 32766    | main                      | normal routes                                   |
| 32767    | default                   | fallback                                        |

The protection rule has to sit between the local rules and the accepted-routes
rule. Priority 5000 is the conventional choice because it is high enough to
beat 5270 but low enough to leave Tailscale's own marked traffic alone.

## Best practices

- Do not advertise a subnet from a subnet router that lives inside that same
  subnet.
- If the overlap is unavoidable, add the protection rule to every node on the
  subnet, not only to the one that failed.
- Treat ICMP redirects from the router as a routing smell worth investigating.
- Infrastructure devices that do not need remote subnet access should not
  accept routes at all.

## Appendix: what disabling route acceptance does and does not do

Turning off route acceptance stops a node from installing routes advertised by
other subnet routers. It does not block inbound connections to that node.

The direction matters. If a device does not need to reach remote networks
through the tailnet, disabling route acceptance removes the outbound
table-52 path and is the simplest prevention. If the device must accept
routes, the protection rule above keeps its replies on the LAN without giving
up access to remote subnets. The two scenarios:

- No route acceptance: no table-52 entries, no asymmetric path, no protection
  rule needed.
- Route acceptance: table-52 entries exist; add the protection rule so LAN
  traffic still prefers the main table.

## Takeaway

When a host is unreachable from its own network but fine over Tailscale,
suspect policy routing asymmetry before replacing hardware: an overlap between
an advertised subnet and a local interface is enough to black-hole traffic
while every status indicator stays green.
