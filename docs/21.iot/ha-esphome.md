---
title: Home Assistant + esphome integration
tags: [iot, home-assistant, esphome, switchbot, ch340, cp2102]
---

We are going to use ESP32 to extend the pool Raspberry Pi's home assistant poor Bluetooth range. 

> - [cp2102 version:](https://www.amazon.co.jp/gp/product/B0CSN22MFP/ref=ppx_yo_dt_b_asin_title_o00_s00?ie=UTF8&psc=1)
> - [ch340 version:](https://ja.aliexpress.com/item/1005006336964908.html?spm=a2g0o.order_list.order_list_main.22.39a1585aX89MbI&gatewayAdapt=glo2jpn)

## Initial setup (update firmware and connect to wifi)


1. access [esphone.io](https://esphome.io/) 

2. click on Bluetooth Proxy installer 

3. select Generic ESP32

4. chrome browser popup connection section

5. install Bluetooth proxy (follow the on-screen instruction, it would take ~2 minutes)

6. connect wifi (follow the on-screen instruction)


After connecting to wifi, we will need an interface to configure the ESP32 device. We can either use ESPHome container or Home Assistant add-on to configure the ESP32 device.

## ESPHome UI interface and configuration

ESPHome add-on in Home Assistant is needed to integrate the ESP32 with Home Assistant if you are using Home Assistant OS.

Alternatively, for those who use docker home assistant container, we need to install the ESPHome docker container using the following docker-compose file:

```yaml title="docker-compose.yml"
## ...
esphome:
  container_name: esphome
  image: ghcr.io/esphome/esphome:latest
  volumes:
    - <your-local-path-to-store-config>/esphome/config:/config:rw
    # Use local time for logging timestamps
    - /etc/localtime:/etc/localtime:ro
  network_mode: host
  restart: always
```

Run `docker-compose up -d` to start the ESPHome container. Then we can access the ESPHome web interface by visiting `http://<your-home-assistant-ip>:6052` in the browser. 
We can see the new ESP32 proxy device in the ESPHome web interface as a discovered device like below:

![](https://i.imgur.com/n2FLEWR.png)

Click on `ADOPT` then follow the on-screen instruction, during the process, we will be able to get the encryption key for the ESP32 device. Copy it and paste it somewhere. (if you miss it, we can still get it later).

This will take fairly long time to complete, so be patient. It will looks something like this:


![](https://i.imgur.com/JMRKwhJ.png)

After the the process done, we will see the device change from `discovered` to `online` as below:

![](https://i.imgur.com/etvrirl.png)

Now we can unplug it and power it whereever the connected wifi can cover. Then, we are ready integrate the ESP32 device with Home Assistant.

## Home Assistant integration

Go to home assistant, click on `Settings` -> `Devices & Services`, then we will see the ESP32 device in the `Discovered` section. Click on the `CONFIGURE` button and `SUBMIT` to add the device to Home Assistant.

![](https://i.imgur.com/CJJnr25.png)

Then we are ready to go. If you are asked to input the encryption key, you can find it in the ESPHome web interface by clicking on `EDIT` of the ESP32 device. You will find the encryption key under the `api.encryption.key` section.

```yaml
# others...
api:
  encryption:
    key: <your-Base64-encrypted-key>
```

Great! Now we have very good BLE range now, congratulations! 🎉



