---
title: Raspberry Pi 5 NVMe boot
tags: [iot, home-lab, sbc, raspberry-pi]
---

## Introduction

This guide will show you how to boot your Raspberry Pi 5 from an NVMe drive.
This guide is based on the official Raspberry Pi documentation and the guide from the following YouTube videos:

- [FINALLY! NVMe SSDs on the Raspberry PI](https://youtu.be/EXWu4SUsaY8?si=FsGI3YKnbgYCsxsI) by Jeff Geerling
- [How to boot Raspberry Pi from NVMe](https://youtu.be/MwrdwbYI_7M?si=QI1_f8C1owWHMGzx) by NotEnoughTECH
- [Linux Crash Course - Formatting & Mounting Storage Volumes](https://www.youtube.com/watch?v=2Z6ouBYfZr8&t=1368s) by Learn Linux TV

## Prerequisites

- Raspberry Pi 5 (eg. [Raspberry Pi 5 8GB](https://amzn.asia/d/7Z6Z2Zz) 13980 JP Yen)
- PCIe hat (e.g. [Argon ONE V3 Raspberry Pi 5 Case](https://amzn.asia/d/c6xIahR) 7499 JP Yen)
- NVMe drive (e.g. [WINTER WTPCIe-SSD-256GB](https://amzn.asia/d/eFAX488) 3180 JP Yen)
- Raspberry Pi OS installed

## NVMe boot setup steps

1. Make sure you boot from SD card

2. Update & Upgrade Raspberry Pi OS

```bash
sudo apt update
sudo apt upgrade
```

3. Make sure the NVMe drive is connected to the Raspberry Pi

4. Check the NVMe drive status.
   If you use an already partitioned NVMe drive (especially with exFAT for FAT32 format ), you will come across the error `Failed to write to sector 0: Invalid argument` while trying to use rpi-imager to write the Raspberry Pi OS to the NVMe drive.

   ```bash
   sudo fdisk -l
   # you may see something like this
   Device        Start       End   Sectors  size   Id Type
   /dev/nvme0n1p1  2048  1050623  1048576  512M    c W95 FAT32 (LBA)
   /dev/nvme0n1p2 1050624 62521343 61470720 29.3G  7 HPFS/NTFS/exFAT
   /dev/nvme0n1p3 62521344 62531583    10240  5M   83 Linux
   ```

   ```bash
   lsblk
   # you may see something like this

   NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
   mmcblk0     179:0    0  29.7G  0 disk
   ├─mmcblk0p1 179:1    0  43.9M  0 part /boot/firmware
   └─mmcblk0p2 179:2    0  29.7G  0 part /
   nvme0n1     259:0    0 238.5G  0 disk
   ├─nvme0n1p1 259:1    0   512M  0 part
   ├─nvme0n1p2 259:2    0  29.3G  0 part
   └─nvme0n1p3 259:3    0     5M  0 part
   ```

   If it is the case, you will need to erase the NVMe drive and create a new partition table using `fdisk`. Please refer to [Linux Crash Course - Formatting & Mounting Storage Volumes](https://www.youtube.com/watch?v=2Z6ouBYfZr8&t=1368s) by Learn Linux TV.

5. Use `rpi-imager` or `SD-card copier` to write the Raspberry Pi OS to the NVMe drive.

   - `rpi-imager`: top-left corner -> Accessories -> Raspberry Pi Imager
   - `SD-card copier`: top-left corner -> Accessories -> SD Card Copier

6. Update the boot order to boot from the NVMe drive.

   - open terminal and run `sudo raspi-config`
   - Advanced Options -> Boot Order
   - You will see NVMe boot option. if it is not on the top, move it to the top. Or you can also remove the SD card and reboot the Raspberry Pi.

7. (Optional) Upgrade the NVMe Gen2 to Gen3 speed

   - Use [pibenchmarks command](https://pibenchmarks.com/) to check the speed of the NVMe drive. The speed should be around 350~450 MB/s.
   - Use `sudo lspci -vvvv` to check the PCIe gen, you should see something like `Speed 5GT/s, Width x1 (downgraded)`
   - To upgrade the speed, you need to add `dtparam=pcie_gen=3` to the bottom of `/boot/firmware/config.txt` and reboot the Raspberry Pi.
   - Rerun the `pibenchmarks` command to check the speed. The speed should be around 700~800 MB/s. and `Speed 8GT/s, Width x1` should be shown while running `sudo lspci -vvvv`.
