---
title: Home Assistant with Cloudflare Tunnel
tags: [docker, iot, hass, cloudflare]
---

Make sure you have a Cloudflare account and a domain name registered with Cloudflare.

## Create a new tunnel in Cloudflare.

1. Go to the Cloudflare dashboard and go to the `Zero Trust` section.

2. In the `Network` tab, click on `Tunnels` and then click on `Create a Tunnel`.

3. Copy the token shown on the screen. We will use this token in next step.

## Install Cloudflare Tunnel docker container.

Add the following new service section in your `docker-compose.yaml` file.

```yaml
# ...

services:
  # ... your other services

  cloudflaretunnel:
    container_name: cloudflaretunnel
    image: cloudflare/cloudflared:latest
    restart: unless-stopped
    network_mode: host
    command: tunnel --no-autoupdate run --token <the-token-you-copied-in-previous-step>
```

And then run `docker-compose up -d` to start the Cloudflare Tunnel service.

## Create a Public hostname for your Home Assistant.

Create a Public hostname that points to your Home Assistant server.

![](https://i.imgur.com/s7XaQwe.png)

After doing so, we should be able to access our Home Assistant server from the public hostname. However, Home Assistant blocks the access from reverse proxies by default. We need to add the following configuration to the `configuration.yaml` file.

```
http:
  use_x_forwarded_for: true
  trusted_proxies:
    - <the-ip-of-reverse-service>
```

The way to get the IP of the reverse service is to check the logs of the home assistant docker container.
I use portainer so I just simply access the portainer and check the log like below:

![](https://i.imgur.com/vjofEKs.png)

Then we should be able to access our Home Assistant server from the public hostname.

:::warning

This is not save to expose your Home Assistant server to the public internet. Please make sure you have proper security measures in place before doing so.
You can add the cloudflare authentication layer to protect your application. checkout the useful video tutorial below:

- [https://www.youtube.com/watch?v=ZvIdFs3M5ic&t=1762s](https://www.youtube.com/watch?v=ZvIdFs3M5ic&t=1762s)

- [https://www.youtube.com/watch?v=yMmxw-DZ5Ec](https://www.youtube.com/watch?v=yMmxw-DZ5Ec)

:::

:::tip

Some other info about the HA + Cloudflare Tunnel:

- https://community.home-assistant.io/t/http-integration-is-not-set-up-for-reverse-proxies/313284/4

- https://www.home-assistant.io/blog/2021/06/02/release-20216/#other-backward-incompatible-changes

:::
