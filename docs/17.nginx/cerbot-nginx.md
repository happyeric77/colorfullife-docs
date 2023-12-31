---
title: Publish service with nginx & certbot
tags: [ssl, https, nginx, reverse-proxy, certbot]
---

In this article, we are going to talk about how to publish a service with nginx and certbot.

## prerequisites

1. Nginx

   ```bash
   sudo apt install nginx
   ```

2. Certbot

   ```bash
   sudo apt-get install certbot
   sudo apt-get install python3-certbot-nginx
   ```

3. Domain name
   We will need a registered domain to have an SSL certificate. In our case, we will use cloudflare to manage the domain name.

4. A server with a public IP address (In this case, we will use OCI VM instance)

5. A service running on the server

## Project overview

I have an code-server instance running on my OCI VM instance. I want to publish it with a domain name and SSL certificate. See the table below:

|        | address                                  | example value                          |
| ------ | ---------------------------------------- | -------------------------------------- |
| before | http://${public-ip-addr}:${service-port} | http://129.32.24.11:3001               |
| after  | https://${domain-name}                   | https://code-server.my-domain-name.com |

Before starting,

1. create an ingress rule to allow the service port.
2. make sure you can access the service by the url `http://<public-ip-addr>:<service-port>`

## Setup nginx

1. create the domain on Nginx available site list

   ```bash
   cd /etc/nginx/sites-available/
   touch <domain-name> # in my case, it is code-server.my-domain-name.com

   ```

2. Edit the config file with the following content:

   ```bash
   server {
    server_name code-server.my-domain-name.com;
    location / {
      proxy_pass http://localhost:3001;
      proxy_set_header Host $host;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection upgrade;
      proxy_set_header Accept-Encoding gzip;
    }
   }
   ```

3. Reload nginx server

```
sudo systemctl reload nginx
```

4. create a symbolic link to the sites-enabled folder

```bash
cd /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/<domain-name> <domain-name>
```

5. Restart nginx server

```bash
sudo systemctl restart nginx
```

6. Access the service (Cloudflare only). Skip this section if not using cloudflare

If you are also using cloudflare, you should already be able to access the service with `https://<domain-name>` now because cloudflare will automatically generate a SSL certificate.

However, you will see that the certificate is only between browser and cloudflare. The connection between cloudflare and the server is still not encrypted.

![](https://cloudapp-img-resolver.dev-eric.work??https://share.zight.com/geuB86kY)

You will see the following error message when you use `Full` encryption mode on cloudflare.

![](https://cloudapp-img-resolver.dev-eric.work??https://share.zight.com/4guWAkYD)

7. Create a server certificate with certbot
   we can generate a SSL Certificate for our server with certbot.

```bash
sudo certbot --nginx -d <domain-name>
```

<details>
<summary>output</summary>

```bash
(base) ubuntu@dev-eric:/etc/nginx/sites-available$ sudo certbot --nginx -d code-server.dev-eric.work
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Requesting a certificate for code-server.dev-eric.work

Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/code-server.dev-eric.work/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/code-server.dev-eric.work/privkey.pem
This certificate expires on 2024-03-30.
These files will be updated when the certificate renews.
Certbot has set up a scheduled task to automatically renew this certificate in the background.

Deploying certificate
Successfully deployed certificate for code-server.dev-eric.work to /etc/nginx/sites-enabled/code-server.dev-eric.work
Congratulations! You have successfully enabled HTTPS on https://code-server.dev-eric.work

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
If you like Certbot, please consider supporting our work by:
 * Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
 * Donating to EFF:                    https://eff.org/donate-le
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

```

</details>

<details>
<summary>Auto modified nginx config file</summary>

You will see that certbot automatically modified the nginx config file.

```bash
server {
 server_name code-server.dev-eric.work;
 location / {
   proxy_pass http://localhost:3001;
   proxy_set_header Host $host;
   proxy_set_header Upgrade $http_upgrade;
   proxy_set_header Connection upgrade;
   proxy_set_header Accept-Encoding gzip;
 }


    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/code-server.dev-eric.work/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/code-server.dev-eric.work/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}
server {
    if ($host = code-server.dev-eric.work) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


 server_name code-server.dev-eric.work;
    listen 80;
    return 404; # managed by Certbot


}
```

</details>

:::info
Reference article: https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-18-04
:::

8. Ready to go

Now you should be able to access the service with `https://<domain-name>`.

If you are using cloudflare, you will realize that the site is now available with `Full` encryption mode.

![](https://cloudapp-img-resolver.dev-eric.work??https://share.zight.com/geuB856E)
