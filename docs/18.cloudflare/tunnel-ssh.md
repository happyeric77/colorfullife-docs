---
title: Cloudflare tunnel - ssh access (MacOS)
tags: [cloudflare, zero trust, tunnel]
---

## Use case: ssh access (MacOS)

Accessing home server from outside is crucial as a software engineer when traveling out. However, exposing the ssh port to the public internet is not a good idea. Cloudflare tunnel can help you to achieve this goal. You can create a tunnel to expose your ssh port to the cloudflare network. Then you can use the cloudflare access to control who can access the ssh port.

## Prerequisite

- [cloudflare account](https://dash.cloudflare.com/sign-up)

> You need to have an account and a domain hosted on cloudflare.

- `cloudflared` installed on both server and client machine

## Create a tunnel

We will create a tunnel using `cloudflared` CLI instead of the dashboard.

### Server side

1. Login to cloudflare dashboard

```bash
cloudflared login
```

It will open a browser and ask you to login to your cloudflare account.

2. Create a tunnel

```bash
cloudflared tunnel create <tunnel_name>
```

<details>
<summary>Output</summary>

```bash
❯ cloudflared tunnel create ssh-macmini
Tunnel credentials written to /Users/macbookpro4eric/.cloudflared/f7ec7104-266c-4242-9342-c90926826008.json. cloudflared chose this file based on where your origin certificate was found. Keep this file secret. To revoke these credentials, delete the tunnel.

Created tunnel ssh-macmini with id f7ec7104-266c-4242-9342-c90926826008
2024-01-28T09:02:47Z WRN Your version 2024.1.2 is outdated. We recommend upgrading it to 2024.1.5
```

then you will see a file `~/.cloudflared/f7ec7104-266c-4242-9342-c90926826008.json` is created in `~/.cloudflared` folder.

</details>

In my case, I use `ssh-macmini` as the tunnel name.

3. Config from where the traffic will be forwarded to

```bash
cloudflared tunnel route dns <tunnel_name> <host_name>

```

<details>
<summary>Example</summary>

```bash
❯ cloudflared tunnel route dns ssh-macmini ssh-mypc.dev-eric.work
2024-01-28T09:15:20Z INF Added CNAME ssh-mypc.dev-eric.work which will route to this tunnel tunnelID=f7ec7104-266c-4242-9342-c90926826008
```

After doing so, you will see a CNAME record is created in your cloudflare DNS setting.

![Imgur](https://i.imgur.com/oVeQkM3.png)

</details>

> Ref [official doc](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/routing-to-tunnel/dns/#route-traffic-from-the-command-line)

4. Config the tunnel ingress rule

```bash
cd ~/.cloudflared
vim config.yml
```

Edit the content to be as below (replace the corresponding values of your own):

```yaml
tunnel: f7ec7104-266c-4242-9342-c90926826008 # tunnel id
credentials-file: /Users/macbookpro4eric/.cloudflared/f7ec7104-266c-4242-9342-c90926826008.json # tunnel credential file dir

ingress:
  - hostname: ssh-mypc.dev-eric.work # domain where the traffic will be forwarded from
    service: ssh://localhost:22 # service to be forwarded to (ssh port)
  - service: http_status:404
```

5. Start the tunnel

```bash
cloudflared tunnel run <tunnel_name> # in my case, it is ssh-macmini
```

6. Migrate the tunnel to the cloudflare dashboard
   Before migrating, you need to run `cloudflared tunnel run <tunnel_name>` to start the tunnel.

Since we created the tunnel using CLI, it is not shown in the dashboard. This tunnel is locally managed. If you want to manage this tunnel through the dashboard, click Configure to begin migrating the configuration.

![Imgur](https://i.imgur.com/aa9B25I.png)

Then you will need to follow the instruction to migrate the tunnel to the dashboard.
After that, you will be able to manage the tunnel through the dashboard. But all changes from local config.yml will no longer take effect from now.

Then we will be able to get the token and run the following command to start the tunnel:

```bash
sudo cloudflared tunnel run --token <token>
```

7. Run cloudflared as a service

You can decide you want to run the demon at login or at boot. In my case, I want to run it at login.

```bash
cloudflared service install
```

<details>
<summary>Output</summary>

```bash
2024-01-28T10:25:24Z INF Installing cloudflared client as an user launch agent. Note that cloudflared client will only run when the user is logged in. If you want to run cloudflared client at boot, install with root permission. For more information, visit https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/run-tunnel/run-as-service
2024-01-28T10:25:24Z INF Outputs are logged to /Users/macbookpro4eric/Library/Logs/com.cloudflare.cloudflared.err.log and /Users/macbookpro4eric/Library/Logs/com.cloudflare.cloudflared.out.log
2024-01-28T10:25:24Z INF MacOS service for cloudflared installed successfully
```

</details>

> Ref [official doc](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/configure-tunnels/local-management/as-a-service/macos/#2-run-cloudflared-as-a-service)

### Client side

1. Login to cloudflare dashboard

```bash
cloudflared login
```

It will open a browser and ask you to login to your cloudflare account.

2. Edit the ssh config

```bash
vim ~/.ssh/config
```

Add the following content:

```bash
Host ssh-mypc.dev-eric.work # domain where the traffic will be forwarded from
  ProxyCommand /usr/local/bin/cloudflared access ssh --hostname %h
```

> Ref [official doc](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/use-cases/ssh/#2-connect-as-a-user)

3. Connect to the server

```bash
ssh <user_name>@<host_name>
```

Then you will be able to connect to the server ssh port.

## Reference:

- RPI3 (Ubuntu) ssh by cloudflare tunnel:

<iframe width="560" height="315" src="https://www.youtube.com/embed/GWkoOJT84OE?si=lh9zYlPpi6_HF0qO" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
```
