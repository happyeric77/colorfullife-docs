---
title: Mount NFS Network Drive
tags: [linux, system, file-system, nfs]
---

## What is NFS?

NFS (Network File System) is a distributed file system protocol that allows you to share files and directories over a network. It is a client-server system that allows users to access files across a network and treat them as if they are local files.

**Pros & cons compared to SMB:**

|          | NFS                             | SMB                          |
| -------- | ------------------------------- | ---------------------------- |
| **Pros** | - Faster than SMB               | - More secure than NFS       |
|          | - Better performance            | - More user-friendly         |
|          | - Better for Unix/Linux systems | - Better for Windows systems |
| **Cons** | - Less secure than SMB          | - Slower than NFS            |
|          | - Not user-friendly             | - Less performance           |

:::tip

The very key difference between NFS and SMB is that NFS is designed for Unix/Linux systems, so it inherits the Unix/Linux file system permissions and ownership.
If the use case is doing homelab or working with Unix/Linux systems, NFS is a better choice.
For example, if you are using Docker on a Raspberry Pi and want to mount a shared folder from a NAS device, NFS is a better choice.

:::

## Prerequisites

- A shared NFS folder (for example, NAS device)
- A Linux machine

## Create a NFS shared folder in the NAS device

It depends on the NAS device you are using. In the case of Synology DSM, we can following the steps below:

1. Open the Synology DSM web interface.
2. Go to `Control Panel` > `Shared Folder`.
3. Click `Create` to create a new shared folder. (e.g., `Docker`)
4. Go to `File Station` and create a subfolder in the shared folder. (e.g., `Docker/rpi`)
5. Go to `Control Panel` > `File Services` > `NFS` and enable the NFS service.
6. Go to `Control Panel` > `Shared Folder` > `Edit` > `NFS Permissions` > `Create` to add the NFS permission for the shared folder.

![](https://i.imgur.com/DEypetZ.png)

## Create a directory to mount the shared folder

In the Linux machine, create a directory to mount the shared folder. For example:

```bash
sudo mkdir ~/Docker
```

## Mount the shared folder

`/etc/fstab` is a system file that contains information about filesystems and how they should be mounted. We can add an entry to the `fstab` file to mount the shared folder automatically.

```bash
proc            /proc           proc    defaults          0       0
# ... others
# add-next-line
192.168.0.206:/volume1/Docker/rpi /home/user-name/Docker nfs defaults,uid=1000,gid=1000 0 0
# a swapfile is not a swap partition, no line here
#   use  dphys-swapfile swap[on|off]  for that
```

Ready to go
