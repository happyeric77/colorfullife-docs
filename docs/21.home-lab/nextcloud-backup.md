---
title: Nextcloud (snap version) backup
tags: [nextcloud, backup, snap]
---

:::info
Official documentation: [Nextcloud Snap](https://github.com/nextcloud-snap/nextcloud-snap/wiki/Backup-and-Restore)
:::

:::warning
This operation could be risky using ssh remote connection since the process could be terminated if the connection is lost. It is recommended to do this operation locally (systemd timer).
:::

## Backup

1. Check current state by executing `snap logs nextcloud`

<details>
<summary>Example output</summary>

```bash
❯ sudo snap logs nextcloud
2024-08-29T00:00:16Z nextcloud.logrotate[584775]: considering log /var/snap/nextcloud/current/logs/mysql_errors.log
2024-08-29T00:00:16Z nextcloud.logrotate[584775]:   Now: 2024-08-29 00:00
2024-08-29T00:00:16Z nextcloud.logrotate[584775]:   Last rotated at 2024-08-27 00:00
2024-08-29T00:00:16Z nextcloud.logrotate[584775]:   log does not need rotating (log has been rotated at 2024-8-27 0:0, that is not week ago yet)
2024-08-29T00:00:16Z systemd[1]: snap.nextcloud.logrotate.service: Deactivated successfully.
2024-08-29T01:07:00Z nextcloud.renew-certs[599165]: Saving debug log to /var/snap/nextcloud/current/certs/certbot/logs/letsencrypt.log
2024-08-29T01:07:01Z nextcloud.renew-certs[599165]: - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
2024-08-29T01:07:01Z nextcloud.renew-certs[599165]: No renewals were attempted.
2024-08-29T01:07:01Z nextcloud.renew-certs[599165]: No hooks were run.
2024-08-29T01:07:01Z nextcloud.renew-certs[599165]: - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
```

</details>

2. Stop the Nextcloud snap service

```bash
sudo snap stop nextcloud
```

check the logs again to make sure the service is stopped

<details>
<summary>Example output</summary>

```bash
❯ sudo snap logs nextcloud
2024-08-29T12:29:42Z systemd[1]: Stopped snap.nextcloud.php-fpm.service - Service for snap application nextcloud.php-fpm.
2024-08-29T12:29:42Z systemd[1]: snap.nextcloud.php-fpm.service: Consumed 17h 23min 13.479s CPU time, 28.2G memory peak, 0B memory swap peak.
2024-08-29T12:29:42Z systemd[1]: Stopping snap.nextcloud.redis-server.service - Service for snap application nextcloud.redis-server...
2024-08-29T12:29:42Z systemd[1]: snap.nextcloud.redis-server.service: Deactivated successfully.
2024-08-29T12:29:42Z systemd[1]: Stopped snap.nextcloud.redis-server.service - Service for snap application nextcloud.redis-server.
2024-08-29T12:29:42Z systemd[1]: snap.nextcloud.redis-server.service: Consumed 44min 59.826s CPU time, 18.7M memory peak, 0B memory swap peak.
2024-08-29T12:29:42Z systemd[1]: Stopping snap.nextcloud.renew-certs.service - Service for snap application nextcloud.renew-certs...
2024-08-29T12:29:42Z systemd[1]: snap.nextcloud.renew-certs.service: Deactivated successfully.
2024-08-29T12:29:42Z systemd[1]: Stopped snap.nextcloud.renew-certs.service - Service for snap application nextcloud.renew-certs.
2024-08-29T12:29:42Z systemd[1]: snap.nextcloud.renew-certs.service: Consumed 6.246s CPU time, 75.8M memory peak, 0B memory swap peak.
```

</details>

3. Backup the Nextcloud data directory

```bash
sudo snap save nextcloud
```

4. Restart the Nextcloud snap service

```bash
sudo snap start nextcloud
```

5. Copy or move the backup file to a safe location

I have a local NAS shared folder mounted on my server. I will move the backup file to that location.

```bash
cp /var/lib/snapd/snapshots/TBD /mnt/home-drive-2/nextcloud-backups/
```

:::info
Step 1 and 3 are optional. but recommended.
:::

## Delete the backup snapshot

- Check the list of snapshots

```bash
sudo snap saved
```

- Delete the snapshot

```bash
sudo snap forget <snapshot-id>

```

:::warning
The snap backup is not incremental. It will create a new backup every time you run the command.
:::

## Restore

1. Move the backup file to `/var/lib/snapd/snapshots/`

```bash
sudo cp /mnt/home-drive-2/nextcloud-backups/TBD /var/lib/snapd/snapshots/
```

2. Find the snapshot ID

```bash
sudo snap saved
```

3. Restore the snapshot

```bash
sudo snap restore <snapshot-id>
```

:::warning

1. Before restoring the snapshot, ensure Nextcloud snap is installed.
2. Restoring the snapshot will overwrite the current data

:::

## TODO: systemd timer for automatic backup regularly
