---
title: Controlling an IR air conditioner with Zigbee2MQTT
description: IR is one-way and AC remotes send full state, not button presses. That shapes the whole integration.
date: 2026-03-04
type: build-log
project: home-assistant
topics:
  - home-automation
  - zigbee
  - mqtt
featured: false
---

A small Zigbee IR blaster turns dumb appliances into things Home Assistant can
control — TVs, fans, air conditioners. The integration is simple on paper:

```text
Home Assistant → mqtt.publish → Zigbee2MQTT → IR blaster → appliance
```

The interesting part is the protocol. IR has no feedback and no handshake, and
air conditioner remotes do not send commands — they send full state.

## Codes are states, not buttons

A TV remote sends "volume up". An air conditioner remote sends the complete
state every time: power, mode, target temperature and fan speed together.
There is no "make it one degree warmer"; there is only "Cool, 26 °C, fan
auto".

That means one learned code per state you want to use, and automation logic
that picks a state instead of pressing buttons.

## Learning codes

In the Zigbee2MQTT device page, expose and enable **Learn IR code**, point the
physical remote at the blaster, and press the button you want to capture. The
code lands in a sensor like `sensor.<device>_learned_ir_code` as a long base64
string — often over a thousand characters.

A practical set for an air conditioner:

- `Auto`
- `Cool 25`
- `Cool 26`
- `Off`

## Sending codes

From Home Assistant the reliable path is `mqtt.publish`:

```yaml
action: mqtt.publish
data:
  topic: zigbee2mqtt/<friendly_name>/set
  payload: '{"ir_code_to_send": "<BASE64>"}'
```

Three things that cost time before they are understood:

1. **The topic needs the Zigbee2MQTT friendly name**, which may be different
   from the name Home Assistant shows for the device.
2. **`base_topic` is needed when publishing from Home Assistant or
   `mosquitto_pub`, but not in the Zigbee2MQTT Dev Console** — the console is
   already inside that topic namespace. Adding the prefix there produces
   "Entity 'zigbee2mqtt' unknown".
3. **Do not use `text.set_value`** on the exposed IR-code text entity. It is
   limited to 255 characters while the codes are much longer, and the send
   fails with a generic "Unknown error".

## Automation design

Because every code is a complete state, keep the state set small and let the
automation choose:

- room temperature above 28 °C → send `Cool 26`
- nobody home for 30 minutes → send `Off`

Store the long base64 strings in `secrets.yaml` and reference them, so the
automations stay readable and the codes can be updated in one place.

## Debug checklist

- **Entity unknown** → the topic or the friendly name is wrong.
- **"Entity 'zigbee2mqtt' unknown"** → remove the `base_topic` prefix in the
  Dev Console.
- **"Unknown error"** → the code is too long for the text entity; use
  `mqtt.publish` instead.

IR stays a one-way protocol, so Home Assistant never knows whether the
appliance received the command. Design for the states you can send, and keep
the automation logic simple enough to reason about from the codes alone.
