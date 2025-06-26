---
title: Reformat Disk
tags: [linux, fdisk, partition]
---

### Before you start

Use the following commands to check the disk and partition information on your system:

1. `fdisk -l`: list all drive data
2. `lsblk`: list all drive partitions

```bash
eric@rpi5-argon:~ $ lsblk
NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
sda           8:0    0 238.5G  0 disk
├─sda1        8:1    0   512M  0 part /media/eric/bootfs
└─sda2        8:2    0   238G  0 part /media/eric/rootfs
mmcblk0     179:0    0  29.8G  0 disk
├─mmcblk0p1 179:1    0   512M  0 part /boot/firmware
└─mmcblk0p2 179:2    0  29.3G  0 part /
```

> NOTE:
> sda is a "disk" with two "partitions": sda1 and sda2

### Erase a disk

Use `fdisk /dev/sda` to manage the disk.

```bash
eric@rpi5-argon:~ $ sudo fdisk /dev/sda

Welcome to fdisk (util-linux 2.38.1).
Changes will remain in memory only, until you decide to write them.
Be careful before using the write command.


Command (m for help):
```

- Use `p` to print the partition table.

```bash
Command (m for help): p
Disk /dev/sda: 238.47 GiB, 256060514304 bytes, 500118192 sectors
Disk model: Forty
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 33553920 bytes
Disklabel type: dos
Disk identifier: 0xeb5a93b1

Device     Boot   Start       End   Sectors  Size Id Type
/dev/sda1         16384   1064959   1048576  512M  c W95 FAT32 (LBA)
/dev/sda2       1064960 500118191 499053232  238G 83 Linux
```

- Use `g` to create a new empty GPT partition table.

> 💡 Why using GPT? checkout this [video](https://youtu.be/2Z6ouBYfZr8?si=571KVZmaDe5JTET6), (14:00)

```bash
Command (m for help): g
Created a new GPT disklabel (GUID: 9F972404-C735-DE49-90B5-82EC37911356).
The device contains 'dos' signature and it will be removed by a write command. See fdisk(8) man page and --wipe option for more details.
```

Then check the partition table again:

```bash
Command (m for help): p

Disk /dev/sda: 238.47 GiB, 256060514304 bytes, 500118192 sectors
Disk model: Forty
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 33553920 bytes
Disklabel type: gpt
Disk identifier: 9F972404-C735-DE49-90B5-82EC37911356
```

- Use `n` to create a new partition.

```bash

Command (m for help): n
Partition number (1-128, default 1): 1
First sector (2048-500118158, default 2048):
Last sector, +/-sectors or +/-size{K,M,G,T,P} (2048-500118158, default 500117503):

Created a new partition 1 of type 'Linux filesystem' and of size 238.5 GiB.
```

- Use `w` to write the changes to the disk.

```bash
Command (m for help): w

The partition table has been altered.
Calling ioctl() to re-read partition table.
Syncing disks.
```

Finally, check the disk again:

```bash
eric@rpi5-argon:~ $ lsblk
NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
sda           8:0    0 238.5G  0 disk
└─sda1        8:1    0 238.5G  0 part
mmcblk0     179:0    0  29.8G  0 disk
├─mmcblk0p1 179:1    0   512M  0 part /boot/firmware
└─mmcblk0p2 179:2    0  29.3G  0 part /
```

### Format a disk

TODO ... (Check out [this video](https://youtu.be/2Z6ouBYfZr8?si=571KVZmaDe5JTET6) for more details)
