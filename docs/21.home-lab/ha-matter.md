---
title: Home Assistant + Matter integration (Switchbot hub2)
tags: [iot, home-assistant, matter, switchbot]
---

This article is going to talk about how we can integrate the Matter protocol IOT devices with Home Assistant. We will use the SwitchBot hub2 as the Matter bridge to control the Matter devices from Home Assistant.

## Prerequisites

- Home Assistant installed in your home server:
  - Core: 2024.3.3
  - Frontend: 20240307.0

## Install Matter server container in home server

use the following docker compose file to install the Matter server in your home server:

```yaml title="docker-compose.yml"
services:
  matter-server:
    container_name: matter-server
    image: ghcr.io/home-assistant-libs/python-matter-server:5.9 # This is the version I can find out to work with my version of Home Assistant also the SwitchBot hub2
    restart: unless-stopped
    security_opt:
      - apparmor=unconfined
    volumes:
      - <your-path>/data:/data
      - /run/dbus:/run/dbus:ro
    network_mode: host
```

Then connect home assistant to the Matter server. `Settings` -> `Devices & Services` -> `+ Add Integration` -> `Matter (BETA)`. Then you will be asked to enter the Matter server IP address `ws://<your-matter-server-ip>:5580/ws`.

:::warning
**CASE #1: Connect failed**
This means you might input the incorrect IP address of the Matter server.

**CASE #2: Unsupported version**

If you see the error message `The Matter server version is not supported`, you might need to check out the correct version for your Home Assistant. In my case, I found there are two versions of the Matter server available:

1. `ghcr.io/home-assistant-libs/python-matter-server:4.0.2`
2. `ghcr.io/home-assistant-libs/python-matter-server:5.9`
3. `ghcr.io/home-assistant-libs/python-matter-server:5.8.1`

:::

## Connect SwitchBot hub2 to Matter server by Home Assistant

1. Go to the SwitchBot app and add the SwitchBot hub2 to the app.

2. Go to the SwitchBot Hub2 settings and enable the Matter protocol.

3. Go to Home Assistant `Settings` -> `Devices & Services` -> `+ Add Integration` --> `Add Matter device`.

4. Debugging 😱 if you fail to connect

:::tip

**CASE #1: Make sure the IP v6 is set to `auto` in either OpenMediaVault network interface**
The reason is `The Matter protocol relies on (local) IPv6 and mDNS (multicast traffic) which should be able to travel freely in your network. Matter devices that use Wi-Fi (including Thread border routers) must be on the same LAN/VLAN as Home Assistant.`. See more in [this official doc](https://www.home-assistant.io/integrations/matter#unable-to-commission-devices-it-keeps-giving-errors-or-stops-working-randomly)

**CASE #3: Unsupported version with matter device**
If you see this similar error in matter server container logs, meaning the matter device is not supported by the matter server version.
This happens when I use the `ghcr.io/home-assistant-libs/python-matter-server:4.0.2` version.

**CASE #4** `CHIP_ERROR [chip.native.CTL] Failed in verifying 'Attestation Information' command received from the device: err 101`
If you see this error in the matter server container logs, `101` error indicates `kPaaNotFound`. Wee the detail by [this discussion](https://github.com/project-chip/connectedhomeip/issues/26142#issuecomment-1513246576).
This happens when I use the `ghcr.io/home-assistant-libs/python-matter-server:5.8.1` version.

So eventually I found the `ghcr.io/home-assistant-libs/python-matter-server:5.9` version works with my Home Assistant version and the SwitchBot hub2.

:::
