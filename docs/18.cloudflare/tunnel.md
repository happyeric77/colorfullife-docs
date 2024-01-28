---
title: Cloudflare tunnel - application access
tags: [cloudflare, zero trust, tunnel]
---

## Use case: application access

Allow collaborators to access the application without exposing it to the public internet is a common use case. For example, you may want to allow your team members to access the staging environment of your application. However, you don't want to expose it to the public internet.

Cloudflare tunnel can help you to achieve this goal. You can create a tunnel to expose your application to the cloudflare network. Then you can use the cloudflare access to control who can access the application.

## Prerequisite

- [cloudflare account](https://dash.cloudflare.com/sign-up)

> You need to have an account and a domain hosted on cloudflare.

## Create a tunnel

- Login to cloudflare dashboard

- Go to `Network` -> `Tunnel`

- Click `Create Tunnel`

> This will generate a token for you. You will need to install the `cloudflared` (cloudflare tunnel client) on your local machine in which you want to run the application.
> `brew install cloudflared`

- Finish the configuration process in the dashboard

![](https://i.imgur.com/sENAf63.png)

- Run `cloudflared login` to login to connect your local machine to cloudflare account

- Install the tunnel on your local machine using the token generated in the previous step

```bash
sudo cloudflared service install <token>
```

> You will be able to check the installed tunnel through `cloudflared tunnel list`

- Start the tunnel

```bash
 sudo cloudflared tunnel run --token <token>
```

Then cloudflare will run on background and expose your application to the cloudflare network. And you will see the status showing "HEALTHY".
![Imgur](https://i.imgur.com/cRurMzk.png)

:::tip

IMPORTANT NOTE:

1. If you have a WARP client running on your local machine that you want to run the tunnel, you need to stop the WARP client first. Otherwise, the tunnel will not work.

Reference doc: https://community.cloudflare.com/t/question-about-cloudflare-tunnel-argo-tunnel/261296

2. If you realize that the application is not reflecting the latest code change, you will need to purge the cache in the cloudflare dashboard and also clean up the cache in your browser.

![Imgur](https://i.imgur.com/ZuY4kO4.png)

:::
