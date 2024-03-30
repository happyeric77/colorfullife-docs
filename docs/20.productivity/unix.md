---
title: Unix system utility
tags: [api, utility, productivity]
---

## Linux command

- Get json response and format it

```bash
curl -X <METHOD-GET-POST> "<URL>" -H "Content-Type: application" | python -m json.tool
```

- Get the running process in all ports

```bash
sudo ss -tulpn | grep LISTEN
```

- SD card speed test

```bash
dd if=/dev/zero of=/tmp/testfile.img bs=20M count=5 oflag=direct
```

<details>
<summary>Example output</summary>

```bash title="SD card speed test"
pi@raspberrypi:~ $ dd if=/dev/zero of=/tmp/testfile.img bs=20M count=5 oflag=direct
5+0 records in
5+0 records out
104857600 bytes (105 MB, 100 MiB) copied, 3.35802 s, 31.2 MB/s
```

</details>
