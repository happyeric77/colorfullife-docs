---
title: Restore Home Server from Duplicati
tags: [backup, iot, home-assistant, pihole, duplicati]
---

After getting a clean rapsbian OS installed on the Raspberry Pi, we need to update system first:

```bash
sudo apt update && sudo apt upgrade -y && sudo apt full-upgrade -y && sudo apt autoremove -y && sudo apt autoclean -y
```

Reboot system and install docker (comes with docker compose).

```bash
curl -sSL https://get.docker.com | sh
```

Cd into `/opt/` and grant yourself the ownership and change the mode to 777.

```bash
cd /opt/ && \
sudo chown -R pi . && \
sudo chmod -R 777 .
```

Install Duplicati docker container using docker compose.

```bash title="/opt/docker-compose.yml"

version: '3.0'

services:
  duplicati:
    image: lscr.io/linuxserver/duplicati:latest
    container_name: duplicati-backup
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Asia/Tokyo
    volumes:
      - /opt/duplicati/config:/config
      - /opt:/source
    ports:
      - 8200:8200
    restart: unless-stopped

```

And run `sudo docker compose up -d`. Delete the `docker-compose.yml` file after the container is up and running because we will restore this yml file from the backup later.

Access Duplicati from `http://your-home-server-ip:8200` and only restore the `docker-compose.yml` file from the backup.

![](https://i.imgur.com/88mLeBh.png)

Stop the docker container for all your running services besides Duplicati.

```bash
sudo docker stop <container-name>
```

And we need to run the following command to grant the ownership and change the mode of the newly created config files from docker

```bash
cd /opt/ && \
sudo chown -R pi . && \
sudo chmod -R 777 .
```

Remove the auto generated config `rm -rf ./homeasistant/ ./pihole/`.

Then we can see the restored `docker-compose.yml` file in `/opt/` and run `sudo docker compose up -d` to start all the services. In my case, I have

- Home Assistant
- Pi-hole
- Duplicati

Then access deuplicati from `http://your-home-server-ip:8200` again and restore the rest of the files from the backup.

![](https://i.imgur.com/gT94dVR.png)

Then we should be ready to go by creating a new account for HASS
