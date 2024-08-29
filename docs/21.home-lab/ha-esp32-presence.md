## Setting up ESPresense with ESP32

- [https://espresense.com/firmware](https://espresense.com/firmware)

plug in the ESP32 board to the computer through USB cable.

:::info

device info - [ESP-wroom-32 with CH340](https://ja.aliexpress.com/item/1005006336964908.html?spm=a2g0o.order_list.order_list_main.22.39a1585aX89MbI&gatewayAdapt=glo2jpn)

:::

You will see see a `USB Serial(xxxx)` when you click on connect.

Then click `Install`

After install, you will see a new SSID starting with `espresense-xxxx` in the wifi list.

Connect to the wifi and open the browser to `192.168.4.1`

We will see the config page. Firstly, we only need to set up the wifi to connect and the password. Click `Save` on the bottom left corner. Then click `Restart device` on the top left corner.

Then the Esp will connect to the the local lan. Find the IP address of the ESP32 in the router page and visit the IP address in the browser.

:::tip

If we cannot find the IP address of the ESP32, now we probably able to see a new `visit this device` if we connect through USB cable to https://espresense.com/firmware
:::

Now we can start configuring the MQTT server (brocker) to which we want this ESP32 to connect.

- Server: Home Assistant IP address
- Port: 1883
- Username: <mosquitto-broker-username>
- Password: <mosquitto-broker-password>

Click `Save` and `Restart device`.

Now go back to home assistant, we will see the a new entity in the MQTT integration block.

## Enroll devices to the ESPpresense sensor

Go to the ESPresense sensor web page, click on devices, then click on `Enroll` button. Follow the on-screen instruction to enroll the device.

After enroll , modify the `configuration.yaml` file in the Home Assistant to add the new device mqtt sensor.

```yaml
sensor:
  - platform: mqtt_room
    name: 'Eric iPhone SE 2' # enrolled name
    device_id: 'eric_iphone_se' #device id
    state_topic: 'espresense/devices/eric_iphone_se' # must follow this convention espresense/devices/<device_id>
    timeout: 10
    away_timeout: 120
```

Then we are good to go.
