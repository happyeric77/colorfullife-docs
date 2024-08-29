## Install MQTT broker `mosquitto` as a Docker container

- [mosquitto docker image](https://hub.docker.com/_/eclipse-mosquitto)

```yaml title="docker-compose.yml"
# ... others

mosquitto:
  image: eclipse-mosquitto
  container_name: mosquitto
  volumes:
    - <path-to-the-local-store>/opt/mosquitto:/mosquitto
    - <path-to-the-local-store>/opt/mosquitto/data:/mosquitto/data
    - <path-to-the-local-store>/opt/mosquitto/log:/mosquitto/log
  ports:
    - 1883:1883
    - 9001:9001
```

Create `mosquitto.conf` under `<path-to-the-local-store>/opt/mosquitto/config`:

```conf title="mosquitto.conf"
persistence true
persistence_location /mosquitto/data/
log_dest file /mosquitto/log/mosquitto.log
listener 1883

## Authentication ##
# allow_anonymous true
```

Then run `sudo docker compose up -d` to start the container.

Access the container shell:

```bash
sudo docker exec -it mosquitto /bin/sh
```

:::warning

mosquitto container does not support `bash` shell, use `/bin/sh` instead.

> Reference: [stakeoverflow](https://stackoverflow.com/questions/66079871/error-in-docker-exec-in-eclipse-mosquitto)

:::

```bash
mosquitto_passwd -c /mosquitto/config/password.txt mosquitto@hass
```

<details>
<summary> Output </summary>

```bash
mosquitto_passwd -c /mosquitto/config/password.txt mosquitto@hass
Password:
Reenter password:
Warning: File /mosquitto/config/password.txt group is not root. Future versions will refuse to load this file./ #
```

</details>

Than we will see a file `password.txt` created under `/mosquitto/config` folder.

Now add the following line to `mosquitto.conf`:

```conf

# add-next-line
allow_anonymous false
# add-next-line
password_file /mosquitto/config/password.txt

```

Restart the container `sudo docker restart mosquitto`.

Now the MQTT broker is ready to be used in the server ip under port `1883`.

The next step is to configure the Home Assistant to use this MQTT broker.

## Add MQTT broker to Home Assistant integration

Go to `Settings` -> `Devices & Integrations` -> `+ Add Integration`

Search for `MQTT` and click on it.

Fill the form with the following information:

- Broker: `server-ip`
- Port: `1883`
- Username: `mosquitto@hass`
- Password: `<password-set-on-prev-step>`

Now Home Assistant is able to use the MQTT broker.

:::info

- [Youtube guide](https://www.youtube.com/watch?v=cZV2OOXLtEI)

:::
