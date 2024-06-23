official site: https://docs.openmediavault.org/en/latest/installation/on_debian.html
github: https://github.com/OpenMediaVault-Plugin-Developers/installScript

```bash title="Install without changing network interfaces"
wget https://github.com/OpenMediaVault-Plugin-Developers/installScript/raw/master/install
chmod +x install
sudo ./install -n
```

:::tip
**Useful links**

- [Video guide: install](https://www.youtube.com/watch?v=t52Nd6k_9cc)

- [Video guide: setup](https://www.youtube.com/watch?v=xYJ2QayKj-U)

- [Debug: Install headlessly](https://forum.openmediavault.org/index.php?thread/49629-installing-omv-on-raspberry-pi-4-without-using-wired-ethernet/)

:::

## General config

Thanks DB Tech for the [video guide](https://www.youtube.com/watch?v=gG9qFxedsHw&list=PLhMI0SExGwfAU-UMeKxd1Lu5_a60AlA9N&index=3)

## Setup docker

Thanks DB Tech for the [video guide](https://www.youtube.com/watch?v=f8Yoo4FRGBU&t=91s)

```yml
version: "3"

services:
  portainer:
    container_name: portainer
    image: portainer/portainer-ce:latest
    ports:
      - 9443:9443
    volumes:
      - /srv/dev-disk-by-uuid-6395853c-b35b-45d2-ae4b-9259a5949384/opt/portainer/data:/data
      - /var/run/docker.sock:/var/run/docker.sock
    restart: unless-stopped

  duplicati:
    image: lscr.io/linuxserver/duplicati:latest
    container_name: duplicati
    environment:
      - PUID=0
      - PGID=0
      - TZ=Asia/Tokyo
    volumes:
      - /srv/dev-disk-by-uuid-6395853c-b35b-45d2-ae4b-9259a5949384/opt:/source # This will create a /source/ directory in the container with the host's /opt/ directory content in it, so that Duplicati can backup the /opt/ directory of our home server.
      - /srv/dev-disk-by-uuid-6395853c-b35b-45d2-ae4b-9259a5949384/opt/duplicati/config:/config # The will create a /opt/duplicati/config/ directory in which we have access to the Duplicati's /config/ directory content in host /opt/ (it is so that we can also backup the Duplicati's configuration.)

    ports:
      - 8200:8200
    restart: unless-stopped
```
