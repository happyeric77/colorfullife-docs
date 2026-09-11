---
title: Reading CPU temperature into Home Assistant
description: Home Assistant has no CPU temperature sensor out of the box. On a Raspberry Pi, the kernel already exposes one.
date: 2026-03-30
type: field-note
project: home-assistant
topics:
  - home-automation
  - raspberry-pi
featured: false
---

Home Assistant does not expose the host's CPU temperature as an entity. On a
Raspberry Pi that is a useful number to have — for dashboards, but also for
automations that react to a hot board.

The kernel already provides it. Thermal zones are exposed under `/sys`:

```bash
cat /sys/class/thermal/thermal_zone0/temp
# 47200
```

The value is in millidegrees Celsius, and `type` reports `cpu-thermal`.

## The options

- **command_line sensor** — reads the file directly. Native, no add-on, no
  extra service. Chosen here.
- **Glances add-on** — much broader system stats, at the cost of a running
  service and more resource use.
- **System Monitor** — built in, but on Home Assistant OS it does not offer
  CPU temperature.

## Keeping configuration.yaml readable

The larger principle: `configuration.yaml` should only *include*, not
*define*. The real definitions live in `config/integrations/`, split by
domain:

```yaml
# configuration.yaml
command_line: !include integrations/command_line.yaml
```

```yaml
# config/integrations/command_line.yaml
command_line:
  - sensor:
      name: CPU Temperature
      unique_id: cpu_temperature_thermal_zone0
      command: "cat /sys/class/thermal/thermal_zone0/temp"
      unit_of_measurement: "°C"
      value_template: "{{ value | float / 1000 | round(1) }}"
      scan_interval: 30
      device_class: temperature
      state_class: measurement
```

`device_class: temperature` gives the entity proper units and graph support,
and `state_class: measurement` makes statistics and long-term history work.

## Result

`sensor.cpu_temperature` reports values like `47.2 °C` at idle on a Raspberry
Pi 4, and 30 seconds between samples is more than enough for a slow-moving
thermal value.

From there it can go on a dashboard, into a ventilation automation, or into a
warning when the board approaches its throttling range.
