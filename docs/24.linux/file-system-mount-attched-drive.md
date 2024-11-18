---
title: Mount Attached Drive in Linux
tags: [linux, system, file-system]
---

## find the drive location

If you want to mount the attached drive, you can find the attached drive name by running `lsblk` or `sudo fdisk -l` command. The output will look like:

```bash title="lsblk"
NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
# ... others
sdb      8:16   0 232.9G  0 disk
├─sdb1   8:17   0     1K  0 part
└─sdb5   8:21   0 232.9G  0 part /media/devmon/sdb5-scsi-1USB_3.0_012345
```

In this case, the attached drive name is `sdb5`.

## Create a directory to mount the attached drive

```bash
sudo mkdir /mnt/attached-drive
```

## find the detailed information of the attached drive

```bash
sudo blkid /dev/sdb5
```

Output will look like:

```bash
/dev/sdb5: UUID="b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1" TYPE="ext4" PARTUUID="fb43759d-05"
```

4. Edit the `/etc/fstab` file:

Then exec `sudo vim /etc/fstab` and add the following line:

```bash title="/etc/fstab"
proc            /proc           proc    defaults          0       0
# ... others
# add-next-line
PARTUUID=fb43759d-05  /mnt/attached-drive ext4 defaults 0 0
# a swapfile is not a swap partition, no line here
#   use  dphys-swapfile swap[on|off]  for that
```
