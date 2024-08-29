---
title: ZHA Zigbee coordinator setup
tags: [api, iot, home-assistant]
---

Home assistant has a built-in integration for Zigbee devices called ZHA (Zigbee Home Automation). This integration allows you to connect Zigbee devices to Home Assistant without the need for a separate hub. What we need is a Zigbee coordinator (dongle) that is compatible with ZHA.

:::tip

In this guide, we will use Sonoff Zigbee 3.0 USB Dongle Plus as the Zigbee coordinator.

- [AliExpress link](https://ja.aliexpress.com/item/1005007089589385.html?spm=a2g0o.order_list.order_list_main.47.68e8585asfaXlj&gatewayAdapt=glo2jpn)
- Modal: ZBDongle-E
- Supported Zigbee protocol: Zigbee 3.0
- Supported Zigbee platform: ZHA & Zigbee2MQTT

:::

After plugging the Zigbee coordinator into the USB port of the Home Assistant server, we will need to find out which device path the coordinator is using. We can do this by running the following command:

```shell

for sysdevpath in $(find /sys/bus/usb/devices/usb*/ -name dev);
do
(
  syspath="${sysdevpath%/dev}";
  devname="$(udevadm info -q name -p $syspath)";
  [[ "$devname" == "bus/"* ]] && exit;         eval "$(udevadm info -q property --export -p $syspath)";
  [[ -z "$ID_SERIAL" ]] && exit;
  echo "/dev/$devname - $ID_SERIAL";
);
done

```

The output will look something like this:

```shell
/dev/ttyUSB0 - ITead_Sonoff_Zigbee_3.0_USB_Dongle_Plus_8230afdf55e7ed1198ae6c6262c613ac
/dev/sda - Patriot_Burst_83260707050800371639
/dev/sda1 - Patriot_Burst_83260707050800371639
/dev/sdb - USB_3.0_6VCK9R33-0:0
/dev/sdb5 - USB_3.0_6VCK9R33-0:0
/dev/sdb1 - USB_3.0_6VCK9R33-0:0
```

In this case, the Zigbee coordinator is using `/dev/ttyUSB0`.

Next, we need to add the Zigbee coordinator to Home Assistant. Because we are running Home Assistant in a Docker container, we need to add the following configuration to the `docker-compose.yml` file to map the USB device to the Docker container:

```yml
homeassistant:
  # ... others
  devices:
    - /dev/ttyUSB0:/dev/ttyUSB0
  # ... others
```

Run `docker-compose up -d` to restart Home Assistant with the new configuration.

After Home Assistant has restarted, we can add the Zigbee coordinator to ZHA by going to Settings -> + Add Integration -> Zigbee Home Automation.

Then follow the on-screen instructions to add the Zigbee coordinator.

:::info

- Video guide: [Adding Zigbee Coordinator to Home Assistant](https://www.youtube.com/watch?v=DynzcuwaY7s&t=46s)
- text guide: https://smarthomecircle.com/connect-zigbee-device-using-sonoff-zigbee-3-dongle-plus-to-home-assistant

:::

## Add Zigbee devices

Then we can start adding Zigbee devices to Home Assistant. To do this, put the Zigbee device in pairing mode and follow the on-screen instructions in Home Assistant to add the device.
