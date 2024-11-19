---
title: Customizing Home server dashboard with Homer
tags: [iot, home-lab]
---

Homer is a light weight and simple dashboard page run on lighthttpd server.

This is useful to have a quick overview of all the services (docker containers) running on the server.

:::info
GitHub: [b4bz/homer](https://github.com/bastienwirtz/homer)
:::

## Setup Homer docker container

Use the following docker compose file to install Homer dashboard container

```yml
version: '3'

services:
  # ... your other services
  homer:
    image: b4bz/homer
    container_name: homer
    volumes:
      - /home/<your-user-name>/Docker/homer/data:/www/assets
    ports:
      - 8080:8080 # (default: 8080) If you would like to change internal port of Homer from default 8080 to your port choice.
    restart: unless-stopped
    user: 1000:1000 # default user
    environment:
      - INIT_ASSETS=1 # INIT_ASSETS (default: 1) Install example configuration file & assets (favicons, ...) to help you get started.
```

Run `sudo docker-compose up -d` to start the Homer container.

:::warning

You might see the following error in the container when starting the Homer container.

```bash
assets directory not writable. Check assets directory permissions & docker user or skip default assets install by setting the INIT_ASSETS env var to 0
```

This is because the assets directory is not writable by the container user. You need to ensure that the user has the write access to the volumes directory.

```bash
ls -ld /home/<your-user-name>/Docker/homer/data
```

You might see the output as below

```bash
drwxr-xr-x 2 root root 4096 Oct 27 21:51 data
```

You need to change the ownership of the directory to the user running the docker container.

```bash
sudo chown -R <your-user-name>:<your-user-name> /home/<your-user-name>/Docker/homer/data
```

Then restart the Homer container by `sudo docker-compose up -d`

:::

## Edit & style the dashboard

All the style and configuration files are located in the `data` directory. We can change the style by editing the `/home/<your-user-name>/Docker/homer/data/config.yml` file.
