---
title: CFIS mount with fstab
tags: [linux, system, file-system]
---

CIFS is a protocol that allows sharing data over a network. Samba is a popular implementation of the CIFS protocol.

cifs-utils is a package that provides utilities for mounting and managing CIFS mounts.

In this guide, we will mount a shared folder from a NAS device to another Linux machine using the `fstab` file by using the `cifs-utils` package.

## Prerequisites

1. A shared folder on a NAS device (OpenMediaVault in Raspberry Pi 4 in this case)
2. A Linux machine (Ubuntu server 24.04 in this case)

## Install cifs-utils

```bash
sudo apt install cifs-utils
```

## Mount the shared folder

1. Create a directory on Ubuntu server to mount the shared folder:

```bash
sudo mkdir /mnt/home-drive-2
```

2. Edit the `/etc/fstab` file:

Before getting started,

- `<nas-ip-address>`: Find the IP address of the NAS device (e.g., 192.168.0.158)
- `<shared-folder-name>`: Find the shared folder name (e.g., home-drive-2)
- `<nas-user-username> & <nas-user-password>`: Find the username and password of the shared folder
- `<uid> & <gid>` Find the UID and GID of the user on the Ubuntu server, you can find it by running `id` command. The output will look like `uid=1000(eric) gid=1000(eric) groups=1000(eric),4(adm),24(cdrom),27(sudo),30(dip),46(plugdev),101(lxd)`

Then exec `sudo vim /etc/fstab` and add the following line:

```bash
# /etc/fstab: static file system information.
#
# Use 'blkid' to print the universally unique identifier for a
# device; this may be used with UUID= as a more robust way to name devices
# that works even if disks are added and removed. See fstab(5).
#
# <file system> <mount point>   <type>  <options>       <dump>  <pass>
# / was on /dev/sda2 during curtin installation
/dev/disk/by-uuid/dbb5c099-c817-4a1d-a481-0fb24ffcce61 / ext4 defaults 0 1
/swap.img       none    swap    sw      0       0
# add-next-line
//192.168.0.158/home-drive-2 /mnt/home-drive-2 cifs username=<nas-user-username>,password=<nas-user-password>,uid=<uid>,gid=<gid> 0 0

```

3. Mount the shared folder:

Before mounting the shared folder,

- reload system daemons `sudo systemctl daemon-reload`

Then run `sudo mount -a` to mount the shared folder to Ubuntu server `/mnt/home-drive-2`.

Then we should be to see the shared folder content in `/mnt/home-drive-2`.
