---
title: Home server networking (OpenMediaVault env)
tags: [api, iot, home-assistant, openmediavault, networking, dns]
---

Home assistant is always a key component in our home server. In this article, we are going to talk about how we can configure the networking for our home server, especially when we use OpenMediaVault as our home server OS where we have our home assistant docker running.

## Network mode: bridge or host?

|          | Bridge                     | Host (`network_mode: host`)                                           |
| -------- | -------------------------- | --------------------------------------------------------------------- |
| **Pros** | - Isolation                | - Performance                                                         |
|          | - Easy to manage ports     | - **auto-discovery and bluetooth require the host networking system** |
|          | - Easy to manage IPs & DNS | - Need to handle networking manually                                  |

As we can see, there is a trade-off between the two network modes. if device auto discovery, Matter integration or BLE features are not needed , then we’re fine to use bridge mode and pass 8123 into the container.

```yaml title="docker-compose.yml"
# Bridge mode
homeassistant:
  # ...
  ports:
    - 8123:8123
```

:::info

Reference: [Home Assistant Community disucsion](https://community.home-assistant.io/t/avoid-network-mode-host-for-docker/47250)

:::

Otherwise, we need to use host mode to allow the container to access the host networking system.

```yaml title="docker-compose.yml"
# Host mode
homeassistant:
  # ...
  network_mode: host
```

In this article, we are going to talk about how we can configure the networking for our home server when `network_mode: host` is used.

> **NOTE**: Matter integration needs to be adopted in my home assistant.

## Problem to solve

- Outgoing request fails: `ping: google.com: Temporary failure in name resolution` is thrown when you run `ping google.com` in the terminal.

- All the home assistant REST API sensors are not working.

## Solution

### Try to modify the `/etc/resolv.conf` file

The easiest way is directly to set the DNS server in the `/etc/resolv.conf` file by changing the `nameserver` to `1.1.1.1` (Cloudflare DNS) or `8.8.8.8` (Google DNS).

However, this file is managed by `systemd-resolved` and it will be overwritten constantly in OpenMediaVault OS. above solution does not work.

```conf title="/etc/resolv.conf"
# This is /run/systemd/resolve/stub-resolv.conf managed by man:systemd-resolved(8).
# Do not edit.
#
# This file might be symlinked as /etc/resolv.conf. If you're looking at
# /etc/resolv.conf and seeing this text, you have followed the symlink.
#
# This is a dynamic resolv.conf file for connecting local clients to the
# internal DNS stub resolver of systemd-resolved. This file lists all
# configured search domains.
#
# Run "resolvectl status" to see details about the uplink DNS servers
# currently in use.
#
# Third party programs should typically not access this file directly, but only
# through the symlink at /etc/resolv.conf. To manage man:resolv.conf(5) in a
# different way, replace this symlink by a static file or a different symlink.
#
# See man:systemd-resolved.service(8) for details about the supported modes of
# operation for /etc/resolv.conf.

nameserver 127.0.0.53
options edns0 trust-ad
search .

```

### Modify the `systemd-resolved` configuration

In OpenMediaVault OS (6), the networking is managed by `systemd-networkd` and `systemd-resolved`.

When we run `resolvectl status`, we can see the current DNS server:

```bash
pi@raspberrypi:/etc/systemd/network $ resolvectl status
Global
       Protocols: +LLMNR -mDNS -DNSOverTLS DNSSEC=no/unsupported
resolv.conf mode: stub

Link 2 (eth0)
Current Scopes: LLMNR/IPv4 LLMNR/IPv6
     Protocols: -DefaultRoute +LLMNR -mDNS -DNSOverTLS DNSSEC=no/unsupported

Link 3 (wlan0)
Current Scopes: LLMNR/IPv4 LLMNR/IPv6
     Protocols: -DefaultRoute +LLMNR -mDNS -DNSOverTLS DNSSEC=no/unsupported
# ...
```

As can be seen, we do not have any DNS server set up. we change check the config file `/etc/systemd/resolved.conf`. The following is the default configuration.

```conf title="/etc/systemd/resolved.conf"
#  This file is part of systemd.
#
#  systemd is free software; you can redistribute it and/or modify it under the
#  terms of the GNU Lesser General Public License as published by the Free
#  Software Foundation; either version 2.1 of the License, or (at your option)
#  any later version.
#
# Entries in this file show the compile time defaults. Local configuration
# should be created by either modifying this file, or by creating "drop-ins" in
# the resolved.conf.d/ subdirectory. The latter is generally recommended.
# Defaults can be restored by simply deleting this file and all drop-ins.
#
# Use 'systemd-analyze cat-config systemd/resolved.conf' to display the full config.
#
# See resolved.conf(5) for details.

[Resolve]
# Some examples of DNS servers which may be used for DNS= and FallbackDNS=:
# Cloudflare: 1.1.1.1#cloudflare-dns.com 1.0.0.1#cloudflare-dns.com 2606:4700:4700::1111#cloudflare-dns.com 2606:4700:4700::1001#cloudflare-dns.com
# Google:     8.8.8.8#dns.google 8.8.4.4#dns.google 2001:4860:4860::8888#dns.google 2001:4860:4860::8844#dns.google
# Quad9:      9.9.9.9#dns.quad9.net 149.112.112.112#dns.quad9.net 2620:fe::fe#dns.quad9.net 2620:fe::9#dns.quad9.net
#DNS=
#FallbackDNS=
#Domains=
#DNSSEC=no
#DNSOverTLS=no
#MulticastDNS=yes
#LLMNR=yes
#Cache=yes
#CacheFromLocalhost=no
#DNSStubListener=yes
#DNSStubListenerExtra=
#ReadEtcHosts=yes
#ResolveUnicastSingleLabel=no
```

We then need to change the `DNS=` and `FallbackDNS=` to the desired DNS server.

```conf title="/etc/systemd/resolved.conf"
# ...
DNS=1.1.1.1
FallbackDNS=8.8.8.8

```

Then we need to restart the `systemd-resolved` service by runing `sudo systemctl restart systemd-resolved`.

Then try again `ping google.com` and it should work. We can see the DNS server is set up correctly by runing `resolvectl status`.

```bash
Global
          Protocols: +LLMNR -mDNS -DNSOverTLS DNSSEC=no/unsupported
   resolv.conf mode: stub
 Current DNS Server: 1.1.1.1
         DNS Servers 1.1.1.1
Fallback DNS Servers 8.8.8.8

Link 2 (eth0)
Current Scopes: LLMNR/IPv4 LLMNR/IPv6
     Protocols: -DefaultRoute +LLMNR -mDNS -DNSOverTLS DNSSEC=no/unsupported

# ...
```

🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉
