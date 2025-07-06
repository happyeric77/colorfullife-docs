---
title: rsync Daemon
tags: [linux, systemd, rsync]
---

## 📈 Architecture Overview

```mermaid
flowchart TD
  rsync-client[Mac mini - rsync client<br>192.168.68.50]
  subgraph rsync-server[raspberry pi - rsync server<br>192.168.68.51]
    config[/etc/rsyncd.conf<br>path=/tmp/rsync-test]
    systemd[systemd<br>rsync.service]
  end

rsync-client --> rsync-server
systemd --> config
```

---

## 🛠 Server Configuration

**`/etc/rsyncd.conf`:**

```ini
[usbbackup]  # Module name
  path = /tmp/rsync-test     # Destination directory on the server
  read only = false
  auth users = backupuser    # User defined for rsync access
  secrets file = /etc/rsyncd.secrets
```

### 🔐 Authentication Explained

- `auth users` defines which usernames can access this module.
- `secrets file` stores the username-password mapping in the format:

**`/etc/rsyncd.secrets`:**

```ini
backupuser:supersecret123
```

> 🔸 The `backupuser` does **not** need to exist on the OS.
> 🔸 This authentication is entirely internal to the rsync daemon.
> 🔸 `/etc/passwd` and OS accounts are **not** involved.
> ✅ This creates a safer, isolated login system for file sync.

Make sure to restrict the file permission:

```bash
sudo chmod 600 /etc/rsyncd.secrets
```

> 💡 If `auth users` is omitted, the module becomes **publicly writable** (not recommended).

To start the daemon:

```bash
sudo systemctl daemon-reload
sudo systemctl restart rsync
```

---

## 💻 Client Usage

### 1. Test the Connection

```bash
# List available modules
rsync --list-only rsync://backupuser@192.168.68.51/
```

You will be prompted to enter the password.

### 2. Sync Files

```bash
# Upload: Sync local → server
rsync -av /some/local/folder/ rsync://backupuser@192.168.68.51/usbbackup/

# Download: Sync server → local
rsync -av rsync://backupuser@192.168.68.51/usbbackup/ /some/local/folder/
```

---

## ⚠️ Common Error & Solutions

### ❗ Problem

```bash
rsync: [receiver] mkstemp "/.hello-rsync.txt.CH2LTc" (in usbbackup) failed: Permission denied (13)
```

Even though the `rsync` daemon runs as `root`, it doesn't write as `root` by default during file transfers.

By default, if `uid` and `gid` are not specified in `rsyncd.conf`, the daemon uses `nobody:nogroup`, which lacks permissions to write to `/tmp/rsync-test`.

### ✅ Solution 1: Change Directory Ownership to `nobody`

```bash
sudo chown -R nobody:nogroup /tmp/rsync-test
sudo chmod -R 755 /tmp/rsync-test
```

This allows the daemon (running as `nobody`) to write data successfully.

### ✅ Solution 2: Use a Specific User (e.g., `eric`)

Update `rsyncd.conf`:

check the `uid` and `gid` settings:

```bash
id
# uid=1000(eric) gid=1000(eric) groups=1000(eric) ...
```

Then modify `/etc/rsyncd.conf`:

```ini
[usbbackup]
  path = /tmp/rsync-test
  read only = false
  uid = 1000
  gid = 1000
  auth users = backupuser
  secrets file = /etc/rsyncd.secrets
```

Then adjust directory permissions:

```bash
sudo chown -R eric:eric /tmp/rsync-test
```

---

## 🧠 Optional Enhancements

### 1. Enable Module Listing

This helps tools like Hyper Backup or CLI debugging:

```ini
list = yes
comment = USB Backup POC
```

```bash
rsync rsync://backupuser@192.168.68.51/
# Output:
# usbbackup       USB Backup POC
```

---

### 2. Restrict IP Access (Firewall)

Allow access only from LAN or specific clients:

```ini
hosts allow = 192.168.68.0/24
hosts deny = *
```

Or even stricter:

```ini
hosts allow = 192.168.68.50
```

---

### 3. Enable Persistent Logging (via `systemd`)

```bash
sudo systemctl edit rsync
```

Add the following to the override:

```ini
[Service]
ExecStart=
ExecStart=/usr/bin/rsync --daemon --no-detach --config=/etc/rsyncd.conf
StandardOutput=journal
StandardError=journal
```

Then reload:

```bash
sudo systemctl daemon-reload
sudo systemctl restart rsync
```

Watch logs in real-time:

```bash
journalctl -u rsync -f
```

---

## 🔄 Reverting to Default

### 1. Stop & Disable the Daemon

```bash
sudo systemctl stop rsync
sudo systemctl disable rsync
```

### 2. Remove Config Files

```bash
sudo rm /etc/rsyncd.conf
sudo rm /etc/rsyncd.secrets
```

> Optionally, you may only remove `rsyncd.conf` and keep the secrets file.

### 3. Remove systemd Overrides (If Applied)

```bash
sudo systemctl revert rsync
```

### 4. Confirm Status

```bash
sudo systemctl status rsync
```

Expected output:

```
● rsync.service - fast remote file copy program daemon
   Loaded: loaded (/lib/systemd/system/rsync.service; disabled; vendor preset: enabled)
   Active: inactive (dead)
```

### Summary

| Action                         | Command                             |
| ------------------------------ | ----------------------------------- |
| Stop & disable daemon          | `sudo systemctl stop/disable rsync` |
| Remove config file             | `sudo rm /etc/rsyncd.conf`          |
| Remove secrets file (optional) | `sudo rm /etc/rsyncd.secrets`       |
| Remove systemd override        | `sudo systemctl revert rsync`       |
| Check service status           | `sudo systemctl status rsync`       |

---

## 🧹 Synchronization Notes: `--delete`

By default, `rsync` **does not delete** files on the destination that are missing from the source.

```bash
sudo rsync -av ./ rsync://backupuser@192.168.68.51/usbbackup/
```

- ✅ New and updated files are synced.
- ❌ Deleted source files remain on the server.

To keep the destination fully in sync (mirroring):

```bash
sudo rsync -av --delete ./ rsync://backupuser@192.168.68.51/usbbackup/
```

> 🚨 **Caution**: This will remove files on the server that are not present on the client.

🧪 Always test first:

```bash
sudo rsync -av --delete --dry-run ./ rsync://backupuser@192.168.68.51/usbbackup/
```

### Common `--delete` Options

| Option              | Description                                                    |
| ------------------- | -------------------------------------------------------------- |
| `--delete`          | Delete files on the target that no longer exist in the source. |
| `--delete-before`   | Perform deletions before transfer.                             |
| `--delete-during`   | Delete files during the transfer (more efficient).             |
| `--delete-excluded` | Also delete files that were excluded with `--exclude`.         |
