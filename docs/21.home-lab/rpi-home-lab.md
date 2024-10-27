---
title: Setup Raspberry Pi Home Lab with docker
tags: [iot, home-lab, docker, raspberry-pi]
---

In this article, we will set up a Raspberry Pi home lab, which covers all the details from Hardware setup, OS installation and docker setup.

## Hardware & Prerequisites

1. Raspberry Pi 4
2. MicroSD card
3. USB Solid State Drive (SSD) (Optional)

Essentially, Raspberry Pi is booting from the MicroSD card. However, it is recommended to boot from the USB SSD for better performance and reliability.

In this section, we will install Raspberry Pi OS on the MicroSD card and configure it to boot from the USB SSD.

## Install Raspberry Pi OS on MicroSD card

1. Download the Raspberry Pi Imager from the [official website](https://www.raspberrypi.org/software/).

2. Insert the MicroSD card into your computer.

3. Open the Raspberry Pi Imager and select the Raspberry Pi OS desktop version. Then follow the on-screen instructions to write the image to the MicroSD card.

4. Once the image is written, insert the MicroSD card into the Raspberry Pi and power it on.

## Boot from USB SSD

1. After booting from the MicroSD card, open the terminal and run the following command to update the bootloader:

```bash
sudo apt update
sudo apt full-upgrade
sudo rpi-eeprom-update
# Reboot the Raspberry Pi
sudo reboot
```

2. Use the raspberry pi os desktop built-in imager to write the image to the USB SSD. `Accessories` -> `Imager`.

3. After rebooting, open the terminal and run `sudo raspi-config`. Then navigate to

   - `Advanced Options` -> `Boot loader version` -> `E1 Latest ...`
   - `Advanced Options` -> `Boot Order` -> `USB Boot`.

4. Turn off the Raspberry Pi and remove the MicroSD card. Then power it on. The Raspberry Pi should boot from the USB SSD.

## Configure Raspberry Pi

1. Enable Raspberry Pi SSH: `top-left icon` -> `Preferences` -> `Raspberry Pi Configuration` -> `Interfaces` -> `SSH` -> `Enable`.

2. Enable `Connect Raspberry Pi` beta feature if needed. Check the [official documentation](https://www.raspberrypi.com/software/connect/) for more details.

:::info

- [Video guide](https://www.youtube.com/watch?v=KiWtKVgjuFk)

:::

3. Install `screenfetch` to display system information:

```bash
sudo apt install screenfetch
```

:::tip
You might also want to check all the system status using the following command:

1. CPU temperature: `vcgencmd measure_temp`
2. disk partition: `df -h`, `lsblk` and `sudo fdisk -l`
3. memory usage: `free -h`

:::

## Install Docker & Portainer

```bash
# Install docker
sudo apt install docker.io
#  Install docker-compose
sudo apt install docker-compose
```

Above command will install docker on your Raspberry Pi. You can verify the installation by running `docker --version`.

Next, we will install Portainer to manage the docker containers.

Firstly, create a `docker-compose.yml` file:

```yaml title="docker-compose.yml"
version: '3'

services:
  portainer:
    container_name: portainer
    image: portainer/portainer-ce:latest
    ports:
      - 9000:9000
    volumes:
      - /home/eric/Docker/portainer/data:/data
      - /var/run/docker.sock:/var/run/docker.sock
    restart: unless-stopped
```

Then run the following command to start the Portainer container:

```bash
docker-compose up -d
```

Now you can access the Portainer dashboard by navigating to `http://<raspberry-pi-ip>:9000` then rock and roll!
