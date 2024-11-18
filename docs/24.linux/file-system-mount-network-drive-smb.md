---
title: Mount SMB Network Drive using CFIS utils
tags: [linux, system, file-system]
---

CIFS is a protocol that allows sharing data over a network. Samba is a popular implementation of the CIFS protocol.

cifs-utils is a package that provides utilities for mounting and managing CIFS mounts.

In this guide, we will mount a shared folder from a NAS device to another Linux machine using the `fstab` file by using the `cifs-utils` package.

## Prerequisites

1. A shared SMB folder (for example, NAS device)
2. A Linux machine

## Install cifs-utils

```bash
sudo apt install cifs-utils
```

## Create a SMB shared folder in the NAS device

It depends on the NAS device you are using. In the case of Synology DSM, we can following the steps below:

1. Open the Synology DSM web interface.
2. Go to `Control Panel` > `Shared Folder`.
3. Click `Create` to create a new shared folder. (e.g., `Docker`)
4. Go to `File Station` and create a subfolder in the shared folder. (e.g., `Docker/rpi`)

:::tip

The best practice is creating a new user in the NAS device to access the shared folder.
NOTE: the `SMB` & `Shard Folder` permission should be granted properly.

:::

## Create a directory to mount the shared folder

In the Linux machine, create a directory to mount the shared folder.

```bash
sudo mkdir ~/Docker
```

## Mount the shared folder

`/etc/fstab` is a system file that contains information about filesystems and how they should be mounted. We can add an entry to the `fstab` file to mount the shared folder automatically.

1. Find the IP address of the NAS device
2. Edit the `/etc/fstab` file

```bash
proc            /proc           proc    defaults          0       0
# ... others
# add-next-line
//192.168.0.206/Docker/rpi /home/user-name/Docker cifs username=nas-user-username,password=nas-user-password,uid=1000,gid=1000 0 0
# a swapfile is not a swap partition, no line here
#   use  dphys-swapfile swap[on|off]  for that
```

:::info

- `<nas-ip-address>`: Find the IP address of the NAS device (e.g., 192.168.0.158)
- `<shared-folder-name>`: Find the shared folder name (e.g., Docker/rpi)
- `<nas-user-username> & <nas-user-password>`: Find the username and password of the shared folder
- `<uid> & <gid>` Find the UID and GID of the user on the Ubuntu server, you can find it by running `id` command. The output will look like `uid=1000(eric) gid=1000(eric) groups=1000(eric),4(adm),24(cdrom),27(sudo),30(dip),46(plugdev),101(lxd)`

:::

## Mount the shared folder

credentials=/.secrets/synology-rpi-argon

```bash
# reload system daemons
sudo systemctl daemon-reload

# mount the shared folder
sudo mount -a
```

Then we should be to see the shared folder content in `~/Docker`.

:::warning

If you come across the permission issue accessing the shared folder by applications (e.g., Docker), it is because the `cifs` mount does not support the Unix/Linux file system permissions and ownership.
The solution is to use `nfs` instead of `cifs`.

:::
