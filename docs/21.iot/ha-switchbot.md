---
title: Home Assistant + SwitchBot API
tags: [api, iot, home-assistant]
---

In this article, we are going to talk about how we can integrate SwitchBot with Home Assistant. We will use the SwitchBot API to control the SwitchBot devices from Home Assistant.

## Prerequisites

Before we start, you will need to have the following:

1. A SwitchBot account
2. Some SwitchBot devices
3. A home server running in your home network (e.g., Raspberry Pi, NAS, etc.)

## Install docker in your home server

It depends on your system, we use the following command for Raspberry Pi4:

```bash
curl -sSL https://get.docker.com | sh

sudo usermod -aG docker pi
```

:::tip

The command `sudo usermod -aG docker pi` is used to add the user pi to the docker group.

In Linux, the Docker daemon binds to a Unix socket instead of a TCP port. By default that Unix socket is owned by the user root and other users can only access it using sudo. The docker group is created to allow non-root users to execute Docker commands without using sudo.

So, this command is essentially giving the pi user permission to run Docker commands without needing sudo.

:::

## Install Home Assistant in your home server

Firstly, you will need to install Home Assistant on your home server. We use [Docker compose](https://www.home-assistant.io/installation/raspberrypi#docker-compose) to install Home Assistant.
sudo cloudflared service install eyJhIjoiYjIwNjMzYWQxZDc4MzQxM2MzNmY3MDVmZWZjZmU1MzIiLCJ0IjoiNDZjMDU5MmMtN2M2ZS00ZTI1LTk1MTQtMjc5YzI3Njg4MjQzIiwicyI6IlltTmxOak13WmpndE16a3hPQzAwWW1FNExUazBNemd0WldFd1lXWXpaVEUwWVRsaSJ9
:::info
You can refer to [this video](https://www.youtube.com/watch?v=DV_OD4OPKno&t=403s) to check the difference between running Home Assistant in Docker and Home Assistant OS.
:::

- Create a docker-compose file `hass.yml`:

```bash title="home/pi/Projects/docker-compose/hass.yml"
version: '3'
services:
  homeassistant:
    container_name: homeassistant
    image: "ghcr.io/home-assistant/home-assistant:stable"
    volumes:
      - /opt/homeasistant/config:/config
      - /etc/localtime:/etc/localtime:ro
      - /run/dbus:/run/dbus:ro
    restart: unless-stopped
    privileged: true
    network_mode: host
```

- Run the following command to start Home Assistant:

```bash
docker-compose -f /home/pi/Projects/docker-compose/hass.yml up -d
```

Then we can access Home Assistant from `http://your-home-server-ip:8123`.

## Get the SwitchBot API token

To control the SwitchBot devices from Home Assistant, we will need to get the SwitchBot API token. You can refer to the following [reference docs](https://support.switch-bot.com/hc/en-us/articles/12822710195351-How-to-obtain-a-Token) to get the token.

## Integrate SwitchBot with Home Assistant using the SwitchBot API

We will use switchbot-api v1.0 to control the SwitchBot devices. You can refer to the [official documentation](https://github.com/OpenWonderLabs/SwitchBotAPI/blob/main/README-v1.0.md)

:::info
v1.1 is more secure but much more complicated. We are using v1.0 which does not encrypt the token since we only use it in our local network. If your local network is not secure, you should use v1.1.
:::

Before getting start, make sure you have a basic understanding of the [Home Assistant configuration](https://www.home-assistant.io/docs/configuration/).

:::tip

Reference video: [https://www.youtube.com/watch?v=ZLsTgXILabE&t=908s](https://www.youtube.com/watch?v=ZLsTgXILabE&t=908s)

:::

### Get all devices status

```bash
curl -X GET "https://api.switch-bot.com/v1.0/devices/" -H "Authorization: Bearer your-switchbot-api-token" -H "Content-Type: application/json" | python -m json.tool

```

### Temperature and humidity sensor

```yaml title="secrets.yaml"
# ...
switchbot_api_token: "Bearer your-switchbot-api-token"
switchbot_meter_status_url: "https://api.switch-bot.com/v1.0/devices/your-device-id/status"
```

```yaml title="configuration.yaml"
# ...
sensor: !include sensors.yaml
# ...
```

```yaml title="sensors.yaml"
# ...
- platform: rest
  name: "Meter Sensor"
  unique_id: "meter_senser"
  resource: !secret switchbot_meter_status_url
  method: GET
  scan_interval: 300
  headers:
    Authorization: !secret switchbot_api_token
    Content-Type: "application/json"
  value_template: "temp: {{ value_json.body.temperature }} | humidity: {{value_json.body.humidity}}"
  json_attributes_path: "$.body"
  json_attributes:
    - humidity
    - temperature
```

### Switch category

The following types of devices can be categorized as switches since it can be turned on and off only.

1. Strip led light
2. Bot
3. Plug
4. IR light

```yaml title="secrets.yaml"
# Strip led light

switchbot_sofa_strip_light_status_url: "https://api.switch-bot.com/v1.0/devices/your-device-id/status"
switchbot_sofa_strip_light_deviceId: "your-device-id"

# Switch
switchbot_downlight_status_url: "https://api.switch-bot.com/v1.0/devices/your-device-id/status"
switchbot_downlight_deviceId: "your-device-id"

# IR devices
switchbot_living_light_deviceId: "your-device-id"

switchbot_bedroom_light_deviceId: "your-device-id"

# Plug
switchbot_bed_strip_light_status_url: "https://api.switch-bot.com/v1.0/devices/your-device-id/status"
switchbot_bed_strip_light_deviceId: "your-device-id"
```

```yaml title="configuration.yaml"
# ...
rest_command:
  switchbot_device_command:
    url: "https://api.switch-bot.com/v1.0/devices/{{ deviceId }}/commands"
    method: post
    content_type: "application/json"
    headers:
      Authorization: !secret switchbot_api_token
    payload: '{"command": "{{ command }}", "parameter": "{{ parameter }}"}'

switch: !include switches.yaml
```

```yaml title="switch.yaml"
- platform: template
  switches:
    sofa_strip_light:
      value_template: "{{ is_state('sensor.sofa_strip_light', 'on') }}"
      turn_on:
        service: rest_command.switchbot_device_command
        data:
          deviceId: !secret switchbot_sofa_strip_light_deviceId
          command: "turnOn"
      turn_off:
        service: rest_command.switchbot_device_command
        data:
          deviceId: !secret switchbot_sofa_strip_light_deviceId
          command: "turnOff"

    living_light:
      turn_on:
        service: rest_command.switchbot_device_command
        data:
          deviceId: !secret switchbot_living_light_deviceId
          command: "turnOn"
      turn_off:
        service: rest_command.switchbot_device_command
        data:
          deviceId: !secret switchbot_living_light_deviceId
          command: "turnOff"

    bedroom_light:
      turn_on:
        service: rest_command.switchbot_device_command
        data:
          deviceId: !secret switchbot_bedroom_light_deviceId
          command: "turnOn"
      turn_off:
        service: rest_command.switchbot_device_command
        data:
          deviceId: !secret switchbot_bedroom_light_deviceId
          command: "turnOff"

    downlight:
      value_template: "{{ is_state('sensor.downlight', 'on') }}"
      turn_on:
        service: rest_command.switchbot_device_command
        data:
          deviceId: !secret switchbot_downlight_deviceId
          command: "turnOn"
      turn_off:
        service: rest_command.switchbot_device_command
        data:
          deviceId: !secret switchbot_downlight_deviceId
          command: "turnOff"

    bed_strip_light:
      value_template: "{{ is_state('sensor.bed_strip_light', 'on') }}"
      turn_on:
        service: rest_command.switchbot_device_command
        data:
          deviceId: !secret switchbot_bed_strip_light_deviceId
          command: "turnOn"
      turn_off:
        service: rest_command.switchbot_device_command
        data:
          deviceId: !secret switchbot_bed_strip_light_deviceId
          command: "turnOff"
```

```yaml title="sensors.yaml"
- platform: rest
  name: "Sofa Strip Light"
  unique_id: "sofa_strip_light"
  resource: !secret switchbot_sofa_strip_light_status_url
  method: GET
  scan_interval: 300
  headers:
    Authorization: !secret switchbot_api_token
    Content-Type: "application/json"
  value_template: "{{ value_json.body.power }}"
  json_attributes_path: "$.body"
  json_attributes:
    - brightness
    - color

- platform: rest
  name: "Downlight"
  unique_id: "downlight"
  resource: !secret switchbot_downlight_status_url
  method: GET
  scan_interval: 300
  headers:
    Authorization: !secret switchbot_api_token
    Content-Type: "application/json"
  value_template: "{{ value_json.body.power }}"

- platform: rest
  name: "Bed Strip Light"
  unique_id: "bed_strip_light"
  resource: !secret switchbot_bed_strip_light_status_url
  method: GET
  scan_interval: 300
  headers:
    Authorization: !secret switchbot_api_token
    Content-Type: "application/json"
  value_template: "{{ value_json.body.power }}"
```

:::info

- scan_interval: 300 means we will update the status every 5 minutes. You can change it to any value you like.

- After changing the configuration, you can validate if the yaml by clicking the `Check Configuration` button in the `Development tools`. If it is valid, you can restart the Home Assistant to apply the changes.

:::
