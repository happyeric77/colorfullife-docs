---
title: ZHA device - Smart Button
tags: [api, iot, home-assistant]
---

In this article we are going to cover zigbee smart button integration with ZHA (Zigbee Home Automation) in Home Assistant. The device we are using is

- Modal: IH-K663
- AliExpress link: [IH-K663](https://ja.aliexpress.com/item/1005005394532393.html?spm=a2g0o.order_list.order_list_main.32.134d585ahvloyO&gatewayAdapt=glo2jpn)
- Blackadder: [https://zigbee.blakadder.com/Tuya_IH-K663.html](https://zigbee.blakadder.com/Tuya_IH-K663.html)

After pairing the smart button with ZHA, we will be only able to see two entities, `battery` and `firmware` which are totally not useful. No event is triggered when we press the button.

So we will need to download the [ZHA Quirks](https://github.com/zigpy/zha-device-handlers/blob/dev/zhaquirks/tuya/ts0041.py) and put in under `/config/custom_zha_quirks/` folder.

Then we will need to add the following configuration to `configuration.yaml`:

```yaml
zha:
  enable_quirks: true
  custom_quirks_path: /config/custom_zha_quirks/
```

Restart Home Assistant, remove the smart button and re-pair it again. Now we will be able to see the event when we press the button.

![](https://i.imgur.com/CVioA4u.png)

:::info

Reference: [https://medium.com/@edwarddubilyer/chinese-ts0041-1-bang-zigbee-scene-switch-on-zha-troubleshooting-dd75a90a485f](https://medium.com/@edwarddubilyer/chinese-ts0041-1-bang-zigbee-scene-switch-on-zha-troubleshooting-dd75a90a485f)

:::

Now we can want to listen to the event and then trigger the automation. To know the event data, we can use the `Developer Tools -> Events` to listen to the event.

- Event type: `zha_event`
- Listening to: `zha_event`

Then click `START LISTENING` and press the button. We will see the event data like this:

```yml
event_type: zha_event
data:
  device_ieee: a4:c5:33:31:f2:9e:d6:42
  unique_id: a4:c1:38:32:ff:9e:46:42:1:0x0306
  device_id: 309adaeeafesafeafdq39397cb7c0cc2dc497
  endpoint_id: 1
  cluster_id: 6
  command: press_type
  args:
    - 1
  params:
    press_type: 1
origin: LOCAL
time_fired: "2024-07-29T14:11:33.678875+00:00"
context:
  id: 01J3ZDA35E2R7JQ4RTPBMAC6FD
  parent_id: null
  user_id: null
```

:::tip

Reference: [https://community.home-assistant.io/t/press-type-event-was-fired-with-parameters-press-type-1/670717](https://community.home-assistant.io/t/press-type-event-was-fired-with-parameters-press-type-1/670717)

:::

![](blob:https://imgur.com/d97c5a96-dc71-40de-84ac-040d91d13301)

Finally, We can use this data in our automation like below:

![](https://i.imgur.com/9VzuJji.png)
