---
title: Home Assistant REST command
tags: [api, iot, home-assistant]
---

## Config rest command

```yml title='configuration.yaml'
rest_command:
  command_name:
    url: "https://rest-api-url"
    method: post # or get
    content_type: "application/x-www-form-urlencoded" # or "application/json"
    headers:
      Authorization: "auth-token" # if needed
```

:::tip

Reference: [Home Assistant RESTful Command](https://www.home-assistant.io/integrations/rest_command/)

:::

## Use rest command to impl Line notify

Make sure you have the Line notify token. Then set up the token in `secrets.yaml`:

```yml title='secrets.yaml'
line_notify_token: "Bearer your-line-notify-token"
```

Then add the following to `configuration.yaml`:

```yml title='configuration.yaml'
rest_command:
  line_notify:
    url: "https://notify-api.line.me/api/notify"
    method: post
    content_type: "application/x-www-form-urlencoded"
    headers:
      Authorization: !secret line_notify_token
    payload: "message={{ message }}"
```

Then you can use the `rest_command` in your automation:

```yml title='automation.yaml'
rest_command:
  line_notify:
    url: "https://notify-api.line.me/api/notify?message={{ message }}"
    method: post
    content_type: "application/x-www-form-urlencoded" # Most be this content type
    headers:
      Authorization: !secret line_notify_token
```

:::info

Reference: [Line Notify API](https://notify-bot.line.me/doc/en/)
:::

Then finally we are able to send the message through Line notify in home assistant automation:

![](https://i.imgur.com/9hIyzpH.png)
