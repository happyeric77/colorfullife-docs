---
title: Systemd Timer
tags: [linux, systemd, timer]
---

In this article, we will introduce how to use systemd timer by creating a service unit and timer unit to backup nextcloud snap weekly.

:::tip

- [systemd video](https://www.youtube.com/watch?v=Kzpm-rGAXos)

:::

## Using systemd timer to backup nextcloud snap weekly

Create the following 3 files:

1. `~/backup-nextcloud/backup-nextcloud.sh`
2. `~/backup-nextcloud/backup-nextcloud.timer`
3. `~/backup-nextcloud/backup-nextcloud.service`

### Setup the bash script

Write a script that we want system timer to run weekly to backup nextcloud snap.

```zsh title="~/backup-nextcloud/backup-nextcloud.sh"
#!/bin/bash
set -e

LOG_FILE="/opt/backup-nextcloud/backup-nextcloud.log"

exec > >(tee -a "$LOG_FILE") 2>&1

echo "[$(TZ=Asia/Tokyo date)]: **Nextcloud backup process start**"

SNAPSHOT_PATH=$(find /var/lib/snapd/snapshots -name '*_nextcloud_*.zip' -print -quit)

BACKUP_PATH=$(find /mnt/home-drive-2 -name '*_nextcloud_*.zip' -print -quit)

if [ -n "$SNAPSHOT_PATH" ]; then
    if [ -n "$BACKUP_PATH" ]; then
        echo "$(TZ=Asia/Tokyo date)  Backup of snapshot already exists, removing it"
        rm "$BACKUP_PATH"
        sync
    fi

    echo "$(TZ=Asia/Tokyo date)  Moving snapshot to backup location"
    mv "$SNAPSHOT_PATH" /mnt/home-drive-2/
    sync

    echo "$(TZ=Asia/Tokyo date)  Snapshot moved, removing snapshot"
    sync

    echo "$(TZ=Asia/Tokyo date)  Snapshot removed, backup new one"
else
    echo "$(TZ=Asia/Tokyo date)  Snapshot not found, backup new one"
fi

snap stop nextcloud &&
snap save nextcloud &&
snap start nextcloud

echo "[$(TZ=Asia/Tokyo date)]: **nextcloud backup migration complete**"


```

### Config systemd Service Unit`~/backup-nextcloud/backup-nextcloud.service`

```zsh title="~/backup-nextcloud/backup-nextcloud.timer"
[Unit]
Description=Backup nextcloud snap service
After=snapd.service
Requires=snapd.service

[Service]
ExecStart=/bin/bash /opt/backup-nextcloud/backup-nextcloud.sh

[Install]
WantedBy=multi-user.target
```

### Config systemd Timer Unit

```zsh title="~/backup-nextcloud/backup-nextcloud.timer"
[Unit]
Description=Backup nextcloud timer

[Timer]
OnCalendar=Mon *-*-* 22:00:00
Persistent=true

[Install]
WantedBy=timers.target

```

### Enable and start the timer

```bash

# Move the shell script to /opt/backup-nextcloud/backup-nextcloud.sh and set the permission to root
sudo cp ~/backup-nextcloud/backup-nextcloud.sh /opt/backup-nextcloud/backup-nextcloud.sh

sudo chown root:root /opt/backup-nextcloud/backup-nextcloud.sh

# Move the service and timer to /etc/systemd/system/ and set the permission to root
sudo cp ~/backup-nextcloud/backup-nextcloud.service /etc/systemd/system/backup-nextcloud.service

sudo chown root:root /etc/systemd/system/backup-nextcloud.service

# Move the timer to /etc/systemd/system/ and set the permission to root

sudo cp ~/backup-nextcloud/backup-nextcloud.timer /etc/systemd/system/backup-nextcloud.timer

sudo chown root:root /etc/systemd/system/backup-nextcloud.timer

# Reload the systemd daemon
sudo systemctl daemon-reload

# Enable the timer
sudo systemctl enable backup-nextcloud.timer

# Start the timer
sudo systemctl start backup-nextcloud.timer

# Check the status of the timer
# 1. Check the status of the service
sudo systemctl status backup-nextcloud.timer

# 2. Check the timer list
systemctl list-timers --all


```

We can check out the status of the timer by running `sudo systemctl status backup-nextcloud.timer`.

<details>
<summary>Output</summary>

```bash
❯ sudo systemctl status backup-nextcloud.timer
● backup-nextcloud.timer - Backup nextcloud timmer
     Loaded: loaded (/etc/systemd/system/backup-nextcloud.timer; enabled; preset: enabled)
     Active: active (waiting) since Mon 2024-09-02 07:12:27 UTC; 2min 13s ago
    Trigger: Tue 2024-09-03 05:30:00 UTC; 22h left
   Triggers: ● backup-nextcloud.service
Sep 02 07:12:27 home-server-acer systemd[1]: Started backup-nextcloud.timer - Backup nextcloud timmer.
```

</details>

:::info

- `OnCalendar=Mon *-*-* 22:00:00` means the timer will run every Monday at 22:00:00.

- Systemd timer [video](https://www.youtube.com/watch?v=n6BuUgkZ5T0)

```

```
