---
title: Tailscale Subnet Router and Asymmetric Routing on a Home LAN
tags: [iot, networking, homelab, tailscale, vpn, troubleshooting]
---

## Goal

Document a failure mode that can happen when a Tailscale subnet router advertises the same LAN that other Tailscale nodes already live on.

The symptom is confusing at first:

- a device is reachable over its Tailscale IP
- the same device becomes unreachable over its normal LAN IP
- `ping` from another LAN device shows 100% packet loss

The root cause is usually **asymmetric routing**.

---

## The Setup

In this case:

- `homeassistant` advertises `192.168.68.0/22` as a Tailscale subnet router
- `pi-zero` is both on the LAN and also connected to Tailscale
- a Mac on the same LAN tries to reach `pi-zero` by its normal local IP

```text
Mac (192.168.68.73)
    |
    |  LAN
    v
Pi Zero (192.168.68.100)

Home Assistant (192.168.68.60)
    |
    |  Tailscale subnet router advertising 192.168.68.0/22
    v
Tailscale network
```

This becomes dangerous when the Pi accepts that advertised route and installs the LAN subnet into Tailscale's routing table.

---

## What Goes Wrong

The incoming packet and the reply no longer take the same path.

### Inbound path

The Mac sends traffic directly over the LAN:

```text
Mac (192.168.68.73) -> Pi Zero (192.168.68.100)
```

### Outbound path

The Pi chooses the Tailscale route for the reply:

```text
Pi Zero -> tailscale0 -> Home Assistant -> tries to reach Mac
```

That mismatch is asymmetric routing.

Common symptoms:

- local `ping` fails even though the device is online
- Tailscale access still works
- the router may emit ICMP redirect messages
- `ip route get` shows traffic using `tailscale0` for a local destination

---

## Why One Device Breaks but Another Does Not

The key difference is usually in `ip rule` and Tailscale table `52`.

### Working device

Some systems, such as Home Assistant OS, protect local traffic with a higher-priority rule:

```bash
5000:   from all to 192.168.68.0/22 lookup main
5270:   from all lookup 52
```

That means local destinations are resolved through the normal main routing table first.

### Broken device

On a plain Raspberry Pi OS device, the protection rule may be missing:

```bash
5270:   from all lookup 52
32766:  from all lookup main
```

If table `52` contains this route:

```bash
192.168.68.0/22 dev tailscale0
```

then replies to local peers can be sent into Tailscale instead of the LAN.

---

## How to Confirm It

These commands are the fastest way to verify the problem.

### 1. Inspect policy routing rules

```bash
ip rule show
```

### 2. Inspect Tailscale's route table

```bash
ip route show table 52
```

### 3. Ask Linux which path it will use

```bash
ip route get 192.168.68.60 from 192.168.68.100
```

If the result points to `tailscale0` for a local destination, you found the issue.

Example of the bad result:

```bash
192.168.68.60 dev tailscale0 table 52
```

Expected result:

```bash
192.168.68.60 dev wlan0
```

---

## Fix Option 1: Add a Protection Rule

The most direct fix is to force local subnet traffic to use the main table before Tailscale's table is considered.

```bash
sudo ip rule add from all to 192.168.68.0/22 table main priority 5000
```

After that, `ip rule show` should look like this:

```bash
5000:   from all to 192.168.68.0/22 lookup main
5270:   from all lookup 52
32766:  from all lookup main
```

Now local packets stay on the LAN.

### Persist it with systemd

```ini
[Unit]
Description=Tailscale Local Network Protection Rule
After=network-online.target tailscaled.service
Wants=network-online.target

[Service]
Type=oneshot
ExecStart=/sbin/ip rule add from all to 192.168.68.0/22 table main priority 5000
RemainAfterExit=yes
ExecStop=/sbin/ip rule del from all to 192.168.68.0/22 table main priority 5000

[Install]
WantedBy=multi-user.target
```

Save it as `/etc/systemd/system/tailscale-local-protection.service`, then enable it:

```bash
sudo systemctl daemon-reload
sudo systemctl enable tailscale-local-protection.service
```

---

## Fix Option 2: Do Not Accept Subnet Routes on the Node

Another valid pattern is to prevent the affected node from installing other peers' advertised routes in the first place.

That is what `--accept-routes=false` helps with.

### A common misunderstanding

`--accept-routes=false` does **not** mean:

> other devices cannot reach this machine through a subnet router

What it really means is:

> this machine will not use subnet routes advertised by other Tailscale peers for its own outbound routing decisions

So remote devices can still reach the node through the subnet router. The flag only changes how the node chooses routes for replies and other outbound traffic.

### When this works well

- client devices that should not follow peer-advertised subnet routes
- Raspberry Pi nodes on the same LAN as the subnet router
- setups where you want a simple guardrail without extra policy rules

---

## Which Fix Should You Use?

| Situation | Recommendation |
| --- | --- |
| You want a strong OS-level guarantee for local traffic | Add the priority `5000` IP rule |
| You want to stop the node from importing peer subnet routes | Use `--accept-routes=false` |
| You want maximum safety | Use both |

In my homelab, the IP rule is the clearest protection because it makes the routing behavior explicit and easy to verify.

---

## Best Practices

- Avoid advertising the same subnet a device already sits on unless you really need to
- If you do advertise that subnet, protect every Linux node on that LAN
- Use `ip route get <dst> from <src>` whenever a routing bug feels mysterious
- Reboot and verify again after the fix, especially if the rule must survive restart

---

## Quick Validation Checklist

- `ping` to the LAN IP works again
- `ip route get` for local destinations returns `wlan0` or `eth0`, not `tailscale0`
- `ip rule show` contains the protection rule, if you use that method
- reboot does not remove the protection

---

## Related Reading

- [Setup Tailscale as a Home VPN](/home-lab/tailscale)
- [Setup Pi-hole as Home DNS & Ad Blocker](/home-lab/pihole)
