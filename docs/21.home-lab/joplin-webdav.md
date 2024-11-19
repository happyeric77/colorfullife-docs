---
title: Sync Joplin notes with WebDAV
tags: [iot, home-lab, joplin]
---

[Joplin](https://joplinapp.org/) is an open-source note-taking app that allows you to take notes and organize them in a structured way. It supports markdown, which makes it easy to write and format notes.

In this guide, we will set up Joplin to sync notes with a WebDAV server. This allows you to access your notes from multiple devices and keep them in sync.

## Prerequisites

- A WebDAV server (for example, Synology DMS, Nextcloud)
- Joplin installed on your device

## Setup WebDAV server

### Synology DSM

1. Open the Synology DSM web interface.
2. Go to `Package Center` and install the `WebDAV Server` package.
3. Open the `WebDAV Server` package and enable the service.

### Nextcloud

1. Install Nextcloud on your server.
2. Go to the Nextcloud web interface and create a new user.
3. Enable the WebDAV app in the Nextcloud app store.

## Configure Joplin to sync with WebDAV

1. Open Joplin on your device.
2. Go to `Settings` > `Synchronization`.
3. Select `WebDAV` as the synchronization target.
4. Enter the WebDAV server URL, username, and password.
5. Click `Save` to apply the changes.

![Joplin WebDAV settings](https://i.imgur.com/9b8w8ed.png)
