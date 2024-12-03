---
title: Build & run docker image
tags: [docker]
---

In this article, we will run through how to build a docker image with a sample nodejs application.

## Prerequisites

- Docker installed on the host machine

## Dockerfile

Below is a sample Dockerfile for a nodejs application

```dockerfile
FROM node:16.18.1

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3005
CMD npm run start
```

## Build docker image

```bash

sudo docker build <path-to-dockerfile> -t <image-name>

```

## Run docker image

```bash

sudo docker run --restart=always -d -p <host-port>:<container-port> <image-name>

# NOTE: --restart=always will restart the container if it crashes or if the host is restarted

```

## Use docker-compose

We can also use docker-compose to build and run the docker image. Below is a sample docker-compose file

```yaml
services:
  example-nodejs-app:
    ports:
      - '3005:3005'
    container_name: example-nodejs-app
    restart: always
```
