---
title: Protainer
tags: [docker, utility, productivity, protainer]
---

Portainer is a lightweight management UI which allows you to easily manage your different Docker environments (Docker hosts or Swarm clusters). It is meant to be as simple to deploy as it is to use. It consists of a single container that can run on any Docker engine (Docker for Linux and Docker for Windows are supported).

## Install Portainer

The official docker installation guide is available [here](https://docs.portainer.io/start/install-ce/server/docker/linux). It uses `docker run` command to install Portainer.

However, the recommended way to install Portainer is using Docker compose since we might want to tweak the configuration. Here is the `docker-compose.yml` file to install Portainer:

```yml title="/opt/docker-compose.yml"
version: "3"

services:
  portainer:
    container_name: portainer
    image: portainer/portainer-ce:latest
    ports:
      - 9443:9443
    volumes:
      - /opt/portainer/portainer_data:/data # We do not create a new volume because we persist the data in our self-managed /opt/portainer/ dir
      - /var/run/docker.sock:/var/run/docker.sock
    restart: unless-stopped
```

:::info

- Docker compose reference: [https://stackoverflow.com/questions/73767792/why-is-my-portainer-docker-compose-creating-a-new-volume](https://stackoverflow.com/questions/73767792/why-is-my-portainer-docker-compose-creating-a-new-volume)

:::
