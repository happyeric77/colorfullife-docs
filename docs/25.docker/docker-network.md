---
title: Docker Networking - Understanding Default, Custom, and Host Networks
tags: [docker, cron]
---

There are 3 main docker networks are often used in docker: default-bridge, custom-bridge and host as shown below.

```bash
eric:~/ $ sudo docker network ls
NETWORK ID     NAME                                    DRIVER    SCOPE
d24be9f53feb   eric-custom_default                     bridge    local
c30973bff868   bridge                                  bridge    local
3a59a9c37489   host                                    host      local
33c951c94419   none                                    null      local
```

> When running `ip address show` command, you will be seeing all networks including `docker0` and `br-<network_id>`.

![ac2acb09bd2719e5a925b1fb08e1ab52.png](https://i.imgur.com/SWK4Xdd.png)

## 1. Default Bridge Network (Name: `bridge`)

When using `docker run` without specifying a network, Docker assigns the container to the default bridge network.

![default-bridge.png](https://i.imgur.com/MfOJ4r9.png)

> 🔗 Source: [NetworkChuck on YouTube](https://www.youtube.com/watch?v=bKFMS5C4CG0&t=1060s)

:::warning

⚠️ This default network **does not support container name resolution**, meaning containers cannot communicate using service names. It is generally not recommended for production use.

:::

## 2. Custom Bridge Network (e.g., `eric-custom`)

Custom bridge networks behave similarly to the default bridge but support **DNS-based container name resolution**. This allows containers to talk to each other using their service names, which is essential for many applications.

![custom-bridge.png](https://i.imgur.com/9jiON6i.png)

:::info

> 💡 When using `docker-compose up` or `docker compose up`, Docker automatically creates a custom bridge network named `<project_name>_default`. The `project_name` defaults to the name of the directory containing the `docker-compose.yml` file.

:::

## 3. Host Network (Name: `host`)

The host network mode allows containers to share the host's network stack. The container will not get its own IP but instead use the host's IP address and port space.

![host-network.png](https://i.imgur.com/AJtZj9S.png)

This offers better performance (due to no NAT layer) but increases the risk of security vulnerabilities, as the container can directly access the host's network interfaces and services.

### 🌐 Use Case: Cloudflare Tunnel with Host Network

> **Use case: Cloudflare Tunnel**  
> A practical example of using the host network is running a `Cloudflare Tunnel` container. By sharing the host’s network stack, the container behaves like a native background process. This makes it easier to expose services running on the host machine to the internet via Cloudflare's secure tunneling service.

## 🔧 Extra Tips: Advanced Networking with Docker

### 🛠 How to Create a Custom Network

You can manually create a custom network using:

```bash
docker network create my-custom-network
```

You can also add options like `--subnet` and `--gateway` for custom IP settings.

### 🔗 Sharing a Network Across Multiple Docker Compose Projects

1. First, create a shared external network:

```bash
docker network create shared-net
```

2. In each `docker-compose.yml`, specify the external network:

```yaml
networks:
  default:
    external:
      name: shared-net
```

This allows containers from different Compose projects to communicate with each other.

### 🔍 Inspecting Docker Networks

You can inspect a network’s details using:

```bash
docker network inspect <network_name>
```

This provides useful information such as connected containers, subnet, gateway, etc.—handy for debugging.
