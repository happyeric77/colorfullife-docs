---
title: Self-hosted Bitwarden (VaultWarden) + cloudflare
tags: [bitwarden, self-hosted, cloudflare, vaultwarden]
---

## Self-hosted BitwWrden (VaultWarden) + cloudflare

Vaultwarden is a self-hosted Bitwarden compatible server written in Rust. It is a fork of Bitwarden_rs with additional features and security enhancements. This guide will show you how to set up Vaultwarden with Cloudflare for SSL and DDoS protection.

## Prerequisites

- A domain name
- A server with Docker installed
- A Cloudflare account

## Install Vaultwarden with Docker compose

Add the following section in your `docker-compose.yml` file:

```yaml
# ... other services
vaultwarden:
  image: vaultwarden/server:1.32.5
  container_name: vaultwarden
  restart: unless-stopped
  ports:
    - 8001:80
  volumes:
    - /home/eric/Docker/vaultwarden/data:/data:rw
  environment:
    - ADMIN_TOKEN=<admin_token> # Generate a random token by running `openssl rand -base64 48`
    - WEBSOCKET_ENABLED=true
    - SIGNUPS_ALLOWED=true # initially set to true to allow first user to register then set to false
```

Run `docker-compose up -d` to start the service. You can access the web interface at `http://<server_ip>:8001`.
However, you will realize that you will not be able to sign up for an account because it requires an HTTPS connection. This is where Cloudflare comes in.

## Configure Cloudflare tunnel

We will use Cloudflare tunnel using docker to expose the Vaultwarden service to the internet.

First, create a new cloudflare tunnel through the cloudflare dashboard.

`Zero Trust` -> `Networks` -> `Tunnels` -> `Create a tunnel`.

Copy the token of the tunnel. Then configure the Public Hostname section with the domain name you want to use.

| Subdomain                                  | Domain (required)               |
| ------------------------------------------ | ------------------------------- |
| ex. `vaultwarden` (name whatever you want) | `example.com` (Your own domain) |

| Type (Required) | URL (Required)                           |
| --------------- | ---------------------------------------- |
| `HTTP`          | `<your_server_ip>:<port-of-vaultwarden>` |

Then, add the following section in your `docker-compose.yml` file:

```yaml
# ... other services

cloudflaretunnel:
  container_name: cloudflaretunnel
  image: cloudflare/cloudflared:latest
  restart: unless-stopped
  command: tunnel --no-autoupdate run --token <tunnel_token>
```

Run `docker-compose up -d` to start the service. You

Then we will be able to access the web interface at `https://vaultwarden.example.com`.

:::info

- [Video Tutorial](https://youtu.be/EARDyWw7Id4?si=_AjWqb0bgwL-MUiT)

:::
