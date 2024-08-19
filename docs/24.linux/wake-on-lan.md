---
title: Wake on LAN
tags: [linux, network]
---

Wake on LAN (WoL) is an Ethernet or Token Ring computer networking standard that allows a computer to be turned on or awakened by a network message. The message is usually sent by a program executed on another computer on the same local area network.

## Enable Wake on LAN for the hardware

To enable Wake on LAN, we need to ensure that the server's network card supports it. We can check this by visiting the BIOS mode of the server.

> Usually, press `F2` during boot to enter the BIOS mode.

In the BIOS mode, we can find the network card settings and check if the Wake on LAN feature is enabled. Here is an example.

![](https://i.imgur.com/ZQxmjsV.png)

## Enable Wake on LAN in system OS

After enabling the Wake on LAN feature in the BIOS mode, we also need to enable it in the system OS.

1. Check the network card info:

```bash
ip address show
```

<details>
<summary>Example output</summary>

```bash
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
        valid_lft forever preferred_lft forever
2: enp0s3: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    link/ether 08:00:27:3b:7b:7b brd ff:ff:ff:ff:ff:ff
    inet 192.168.0.108/24 metric 100 brd 192.168.0.255 scope global dynamic enp0s3
       valid_lft 86300sec preferred_lft 86300sec
    inet6 fe80::a00:27ff:fe3b:7b7b/64 scope link
        valid_lft forever preferred_lft forever
```

</details>

We can find the network card name, in this case, `enp0s3`.

2. Check the Wake on LAN status:

```bash
# check the network interface status
sudo ethool enp0s3

# Only check the Wake on LAN status
# sudo ethtool enp0s3 | grep Wake-on
```

<details>
<summary>Example output</summary>

```bash
Settings for enp0s3:
      Supported ports: [ TP MII ]
      Supported link modes:   10baseT/Half 10baseT/Full
                              100baseT/Half 100baseT/Full
                              1000baseT/Full
      Supported pause frame use: Symmetric Receive-only
      Supports auto-negotiation: Yes
      Supported FEC modes: Not reported
      Advertised link modes:  10baseT/Half 10baseT/Full
                              100baseT/Half 100baseT/Full
                              1000baseT/Full
      Advertised pause frame use: Symmetric Receive-only
      Advertised auto-negotiation: Yes
      Advertised FEC modes: Not reported
      Speed: 1000Mb/s
      Duplex: Full
      Port: Twisted Pair
      PHYAD: 0
      Transceiver: internal
      Auto-negotiation: on
      MDI-X: off (auto)
      Supports Wake-on: pumbg
      Wake-on: d
      Link detected: yes
```

</details>

In the output, we can see the `Wake-on` status is `d`, which means it is disabled. (by default)

3. Enable Wake on LAN:

```bash
# Enable Wake on LAN
sudo ethtool -s enp0s3 wol g

```

Then check the status again using `sudo ethtool enp0s3 | grep Wake-on`. The status should be `g` which means it is enabled.

However, the Wake on LAN status will be reset after a reboot. To make it permanent, we can utilize the `netplan` configuration.

4. Persist the Wake on LAN setting:

```bash
# Open the netplan configuration file
cd vim /etc/netplan/

# Edit the configuration file: you will see the yaml file under this directory. In this case, it is `01-network-manager-all.yaml`

sudo vim /etc/netplan/01-network-manager-all.yaml
```

Update the content like below

Then apply the changes:

```yaml title="/etc/netplan/01-network-manager-all.yaml"
# This file is generated from information provided by the datasource.  Changes
# to it will not persist across an instance reboot.  To disable cloud-init's
# network configuration capabilities, write a file
# /etc/cloud/cloud.cfg.d/99-disable-network-config.cfg with the following:
# network: {config: disabled}
network:
  ethernets:
    enp0s3:
      dhcp4: true
      # add-next-line
      wakeonlan: true
  version: 2
  wifis:
    # ... other wifi configurations
```

then run `sudo netplan apply` to apply the changes.

Now, the Wake on LAN feature should be enabled and persistent.

:::tip
You can also use systemd to create a new service to enable Wake on LAN every time the system boots.

However, I think using the `netplan` configuration is more straightforward. If your system is using Netplan to manage the network configuration, it is recommended to use the `netplan` configuration to enable Wake on LAN. (Mine system OS is ubuntu 24.04)

:::

## Send Wake on LAN packet

Before doing so, we first need to know the MAC address of the target machine.

we can get that info from the `ip address show` command output. Then power off the server.

```bash
sudo poweroff --force
```

Then we can send the Wake on LAN packet by sending UDP packets to the broadcast address of the network.

The most common tool to send the Wake on LAN packet for Mac OS is `wakeonlan`. You can install it using `brew install wakeonlan`.

```bash
wakeonlan <MAC_ADDRESS>
```

For Linux, you can use the `ether-wake` command. You can install it using `sudo apt install etherwake`.

Creating the magic packet is simple, so you can find the way to send the wake on LAN packet in all the client OS and send the magic packet to wake up the server locally.

:::info
My favorite way to send the magic packet is using my home assistant.
Please refer to the [Home Assistant Wake on LAN integration](https://www.home-assistant.io/integrations/wake_on_lan/)
:::
