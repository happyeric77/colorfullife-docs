---
title: ESPHome BLE proxy watchdog and self-recovery
tags: [iot, home-assistant, esphome, esp32, bluetooth, troubleshooting]
---

In this article, we are going to talk about a failure mode I hit on an ESP32 BLE proxy used with Home Assistant.

The issue was tricky because the device still looked online:

- WiFi was normal
- ESPHome API was reachable
- but BLE scanning silently stopped

So from Home Assistant it looked half healthy, but in reality the proxy had stopped doing the job it was supposed to do.

## Problem symptoms

I found one of my BLE proxies had these symptoms:

- `scanning: false`
- `discovered_devices: 0`
- `last_detection` had been stale for more than 11 hours

Another BLE proxy in the same home was still working normally, which helped confirm this was not a general Home Assistant problem.

## Environment

My setup at the time was:

- Home Assistant `2026.3.0`
- Home Assistant OS `17.1`
- ESPHome `2026.2.4`
- ESP32 framework: `esp-idf`

The affected devices were ESP32 Bluetooth proxies managed through ESPHome.

If you are starting from scratch with ESPHome Bluetooth proxy setup, check this first:

- [Home Assistant + esphome integration](/home-lab/ha-esphome)

## First confirmation

The first useful check was Home Assistant Bluetooth diagnostics.

The affected proxy showed:

```text
scanning=False
devices=0
```

while another proxy and the built-in Bluetooth scanner on the Home Assistant host were still healthy.

That told me:

- Home Assistant itself was still processing Bluetooth data
- WiFi connectivity was not the main problem
- the ESP32 BLE radio or BLE stack was likely stuck

## What I tried

I tried a few recovery paths first:

| Method | Result |
| --- | --- |
| reload Home Assistant config entry | only reloads HA side, ESP32 not really recovered |
| disable/enable integration | looked better briefly, but BLE devices still stayed at `0` |
| direct restart attempt through API | not available at that moment |
| OTA port retry | timed out |
| compile + OTA through ESPHome dashboard websocket | worked |

The successful recovery path was doing a real ESPHome compile and OTA upload.

That brought the proxy back, but the more important conclusion was:

> I should not rely on manual recovery for this kind of failure.

## Better fix: add a watchdog in ESPHome itself

The real fix was to let the ESP32 detect the problem and reboot itself.

The idea is simple:

- whenever BLE advertisements are seen, update a timestamp
- every 2 minutes, check how long it has been since the last BLE advertisement
- if it has been too long, reboot the device

## ESPHome config

### 1. Track the last BLE activity time

```yaml title="bluetooth-proxy-livingroom.yaml"
globals:
  - id: last_ble_adv_time
    type: uint32_t
    restore_value: no
    initial_value: "0"

esp32_ble_tracker:
  scan_parameters:
    active: false
    window: 15ms
    interval: 320ms
  on_ble_advertise:
    - lambda: |-
        id(last_ble_adv_time) = millis();
```

Every BLE advertisement refreshes `last_ble_adv_time`.

### 2. Add the watchdog check

```yaml title="bluetooth-proxy-livingroom.yaml"
interval:
  - interval: 2min
    then:
      - lambda: |-
          uint32_t now_ms = millis();
          uint32_t last = id(last_ble_adv_time);

          if (now_ms < 180000) return;

          if (last == 0) {
            ESP_LOGW("ble_watchdog", "No BLE adv since boot, restarting");
            App.safe_reboot();
            return;
          }

          uint32_t elapsed = now_ms - last;
          if (elapsed > 600000) {
            ESP_LOGW("ble_watchdog", "No BLE adv for %u ms, restarting", elapsed);
            App.safe_reboot();
          }
```

### Why these numbers?

- `180000 ms` = do not check during the first 3 minutes after boot
- `600000 ms` = if there is no BLE advertisement for 10 minutes, reboot

This keeps the rule simple and practical.

## Add manual recovery helpers too

Besides the watchdog, I also added two small helpers.

### Restart button

```yaml title="bluetooth-proxy-livingroom.yaml"
button:
  - platform: restart
    name: "Restart"
```

This creates entities such as:

- `button.bluetooth_proxy_livingroom_restart`
- `button.bluetooth_proxy_corridor_restart`

### Uptime sensor

```yaml title="bluetooth-proxy-livingroom.yaml"
sensor:
  - platform: uptime
    name: "Uptime"
    update_interval: 60s
```

This makes it easier to tell whether the proxy recently rebooted.

## Why I put the watchdog in firmware instead of Home Assistant automation

This is the most important design decision in this article.

At first, it is tempting to think:

- Home Assistant can monitor diagnostics
- if the scanner stops, Home Assistant can trigger a restart

But for this kind of issue, that approach is weaker.

### Problems with a Home Assistant automation approach

- it depends on Home Assistant being healthy
- it depends on network calls and diagnostics parsing
- it adds extra sensors or REST polling logic
- detection is slower and the logic is spread across multiple places

### Benefits of a firmware watchdog

- the device is self-healing
- no Home Assistant dependency is required for the recovery decision
- no network round trip is needed
- the logic stays next to the BLE config itself

So the principle here is:

> if a device can detect and fix its own health problem, prefer doing it on the device.

## Result after OTA update

After applying the updated ESPHome config and uploading it to both proxies:

- both BLE proxies returned to normal scanning
- restart button entities became available
- uptime sensors became available

The system is now much easier to operate because:

- there is a manual restart option
- transient BLE lockups should recover automatically

## When this pattern is useful

This same pattern is useful for other ESPHome devices too, not only BLE proxies.

For example:

- a sensor that gets stuck and stops reporting
- a radio stack that silently hangs
- a device that stays online but stops doing useful work

## Related reading

- [Home Assistant + esphome integration](/home-lab/ha-esphome)
