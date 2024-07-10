---
title: Duplicati backup
tags: [backup, utility, productivity]
---

Duplicati is a free backup client that securely stores encrypted, incremental, compressed backups on cloud storage services and remote file servers. It works with Amazon S3, Windows Live SkyDrive, Google Drive (Google Docs), Rackspace Cloud Files or WebDAV, SSH, FTP (and many more).

:::info

- https://www.duplicati.com/
- https://github.com/linuxserver/docker-duplicati

:::

## Backup home server system

To secure our home server system configuration, we can use Duplicati to backup the system to the cloud storage.

:::warning

The backup files generated by Duplicati can only be restored by Duplicati. If you suffer a catastrophic failure of your system, you will need to

1. Install your operating system (Linux in my case)
2. Install Docker
3. Install Duplicati Docker container

:::

## Install Duplicati Docker container

Since all our home server services docker containers' configurations are mapped to `/opt`, we want to backup the whole `/opt` directory in our home server.

According we will need to map the `/opt` directory to the Duplicati `/source` directory so that Duplicati can backup the `/opt` directory of our home server. (see below `dupliati.volume`)

```bash title="/opt/docker-compose.yaml"

version: '3.0'

services:
  # ... other services

  duplicati:
    image: lscr.io/linuxserver/duplicati:latest
    container_name: duplicati-backup
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Asia/Tokyo
    volumes:
      - /opt:/source # This will create a /source/ directory in the container with the host's /opt/ directory content in it, so that Duplicati can backup the /opt/ directory of our home server.
      - /opt/duplicati/config:/config # The will create a /opt/duplicati/config/ directory in which we have access to the Duplicati's /config/ directory content in host /opt/ (it is so that we can also backup the Duplicati's configuration.)

    ports:
      - 8200:8200
    restart: unless-stopped

```

After running `sudo docker compose up -d`, we can access Duplicati from `http://your-home-server-ip:8200` and then using the Web UI to backup/restore our home server system config.

:::info

Big thanks to Youtuber Home Automation Guy created this [video](https://www.youtube.com/watch?v=pJqPhYXeulk) to guide through the detailed setup backup process by Duplicati Web UI.

:::

## Embaded Duplicati in Home Assistant

We can also embed Duplicati in Home Assistant navigation panel so that we can manage all our home server services in one place.

```yaml title="/opt/homeassistant/configuration.yaml"
panel_iframe:
  duplicati:
    title: Duplicati
    icon: mdi:backup-restore
    url: http://your-home-server-ip:8200
```