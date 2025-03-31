---
title: Build a Dockerfile to run cronjob
tags: [docker, cron]
---

## Introduction

This article will show you how to build a Dockerfile to run a npm script as a cronjob.

Our project architecture is as follows:

```bash
.
├── Dockerfile
├── docker-compose.yml
├── crontab
├── package.json # with npm run start script
└── src # your source code
    └── index.js
```

The last 3 files could be whatever npm project you would like to build.

## Prerequisites

- Docker installed on the host machine
- npm project with a `npm run start` script

## Dockerfile

In this Dockerfile, we use the `node:18.20.4` image.
We create a user `appuser` to start the npm project & run the cronjob. Below is a sample Dockerfile.

```dockerfile
FROM node:18.20.4

# Install cron
RUN apt update -y && apt install -y cron

# Create user : appuser
RUN useradd -m appuser

# Switch account to root，copy crontab and grant permission. Refer to: https://stackoverflow.com/questions/56340350/run-cron-as-non-root-user
USER root
COPY crontab /home/appuser/app-cron
RUN chown appuser:appuser /home/appuser/app-cron
RUN chmod gu+rw /var/run
RUN chmod gu+s /usr/sbin/cron

# Switch to appuser and exec crontab file
USER appuser
RUN crontab /home/appuser/app-cron

# Set container working directory and copy local files to it
WORKDIR /home/appuser/app
COPY . /home/appuser/app

# Switch to root and grant permission to appuser
USER root
RUN chown -R appuser:appuser /home/appuser/app

# Switch back to appuser and install npm packages
USER appuser
RUN npm install

# Start cron

ENTRYPOINT ["cron", "-f"]
```

As can be seen from the above Dockerfile, we copy a `crontab` file to the container and set it up to run as a cronjob. So we also need to create a `crontab` file. Below is a sample `crontab` file.

## Create crontab file

```bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
TZ=Asia/Tokyo
30 8 * * * cd /home/appuser/app && npm run start >> /home/appuser/cron.log 2>&1
# new line character required!
```

This `crontab` file will run the `npm run start` command every day at 8:30 AM. The output of the command will be logged to `/home/appuser/cron.log`. The last line is a new line character, which is required for the cronjob to work.

:::info

Since the environment of cronjob is different from the environment of the shell, we need to set the `PATH` and `TZ` variables in the crontab file, otherwise the cronjob will not be able to find the `npm` as well as the timezone will not be set correctly. The `TZ` variable is set to `Asia/Tokyo` in this example, you can change it to your local timezone. You can find the list of timezones [here](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

:::

## Build docker image

Finally, we can build the docker image using the following docker-compose file.

```yaml
version: '3.8'
services:
  app:
    build: .
    environment:
      - TZ=Asia/Tokyo
    restart: unless-stopped
```

## Build and run the docker image

When we run the following command, it will build the docker image and run the container, and the cronjob will start running as we configured in the `crontab` file. 🎊🎊🎊🎊

```bash
docker-compose up -d --build
```
