---
title: A firmware watchdog for a BLE proxy
description: When an ESP32 Bluetooth scanner silently stopped, the fix was a watchdog that runs on the device itself.
date: 2026-03-23
type: build-log
project: home-assistant
topics:
  - home-automation
  - esphome
  - esp32
  - bluetooth
featured: false
---

Bluetooth proxies are how Home Assistant sees BLE devices that are out of
range of the host. They are small ESP32 boards running ESPHome, and most of
the time they are invisible infrastructure. When one stops scanning, nothing
crashes: the device stays on Wi-Fi, the API answers, the logs look calm — only
the Bluetooth side goes quiet.

## The symptom

Three proxies cover the house. One of them stopped discovering devices. From
Home Assistant's Bluetooth diagnostics:

- `scanning: false`
- `discovered devices: 0`
- no advertisement seen for about 11.5 hours

The Wi-Fi connection was up, the ESPHome API was responsive, and the other two
proxies were fine. Nothing in the normal device state suggested a problem —
which is exactly why it went unnoticed for half a day.

## What did not work

Home Assistant-side remedies only act on the integration, not on the radio:

- reloading the integration
- disabling and re-enabling the proxy
- talking to it through `aioesphomeapi`
- an OTA update from the command line, which timed out

The scanner only came back after a compile-and-flash from the ESPHome
Dashboard over its WebSocket OTA. That pointed at the device firmware as the
layer that had to recover itself.

## Why a watchdog on the device

An automation in Home Assistant could notice a dead proxy and restart it, but
it depends on Home Assistant, on the network path to the proxy, and on a
polling interval. It has no direct view of the scanner state, and the health
logic ends up spread across YAML files.

The firmware already knows the one thing that matters: when it last saw a BLE
advertisement. That makes a watchdog trivial and local.

## The watchdog

Track the last advertisement time in a global:

```yaml
globals:
  - id: last_ble_adv_time
    type: uint32_t
    restore_value: no
    initial_value: "0"

esp32_ble_tracker:
  on_ble_advertise:
    - lambda: |-
        id(last_ble_adv_time) = millis();
```

Then check it on an interval, with a grace period so a slow boot is not
mistaken for a hang:

```yaml
interval:
  - interval: 2min
    then:
      - lambda: |-
          // Do not reboot while the scanner is still coming up.
          if (millis() < 3 * 60 * 1000) {
            return;
          }
          const uint32_t last = id(last_ble_adv_time);
          if (last == 0 || (millis() - last) > 10 * 60 * 1000) {
            App.safe_reboot();
          }
```

Ten minutes without a single advertisement is far beyond any normal quiet
period, so the reboot is safe. The first occurrence happened weeks before the
watchdog existed; since then the proxy recovers on its own.

Two small helpers make the behavior visible:

```yaml
button:
  - platform: restart
    name: Restart

sensor:
  - platform: uptime
    name: Uptime
    update_interval: 60s
```

The uptime sensor shows whether the watchdog is firing at all, and the restart
button allows a manual kick without opening the dashboard.

## Takeaway

Fix device health on the device. A firmware watchdog is autonomous, local, it
needs no network, it lives in one YAML file, and it reacts immediately. Home
Assistant automations are for logic that spans devices, not for keeping a
single device alive.

The same pattern applies to other silent firmware failures: Wi-Fi that drops
while the API socket stays open, sensors that start returning `NaN`, or a
stuck output that never changes state.
