Install casaOS

```bash
curl -fsSL https://get.casaos.io | sudo bash
```

:::tip

If you face the error with Rclone with older ubuntu version, you can create a symlink for `rm` and `mkdir` to `/usr/bin` like below:

```bash
sudo ln -s /bin/rm /usr/bin/rm

sudo ln -s /bin/mkdir /usr/bin/mkdir

```

- [reference](https://www.reddit.com/r/CasaOS/comments/11f3x3t/casa_os_installation_doesnt_work/)

:::
