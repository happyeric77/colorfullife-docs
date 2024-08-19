---
title: Disable suspend mode when closing the lid
tags: [linux, system]
---

As I 　 am running Ubuntu 20.04 on my old laptop, I want to disable the suspend mode when I close the lid. Here is how I did it:

1. Open the file `/etc/systemd/logind.conf` with your favorite text editor. I use `vim`:

   ```bash
   sudo vim /etc/systemd/logind.conf
   ```

2. Find the line `#HandleLidSwitch=suspend` which is default behavior. Uncomment it and change it to `HandleLidSwitch=ignore`.

:::tip

There are other options you can set:

- suspend: The system will suspend
- hibernate: The system will hibernate
- poweroff: The system will power off
- lock: The system will lock the screen
- ignore: The system will do nothing

:::
