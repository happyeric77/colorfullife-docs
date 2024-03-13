---
title: Slack api
tags: [api, utility, productivity]
---

Using macOS shortcuts with stream deck can be a great way to improve productivity. In this article, we are going to talk about how we can change our slack status just in one click.

## Get the Slack API token

To update our slack status, we will need to firstly [get the slack API token](https://api.slack.com/). You will be able to learn how to get the slack API token from the following reference docs:

1. [English](https://docs.celigo.com/hc/en-us/articles/7140655476507-How-to-create-an-app-and-retrieve-OAuth-token-in-Slack)
2. [Japanese](https://goodlocal.jp/blog/M7p8dmXg)

> Note: #2, it introduces the way to install an stream deck 3rd party plugin. But I don't recommend it since I do not want to put my token in a 3rd party plugin.

There are two api endpoints we are going to use:

1. `users.setPresence`: This endpoint is used to switch between `auto` and `away` status.
2. `users.profile.set`: This endpoint is used to update the status text and emoji.

## Switch between `auto` and `away` status

Here we are going to use `curl` to send a request to the slack API. You can also use other tools like `postman` or `insomnia`.

```bash
curl -X POST "https://slack.com/api/users.setPresence" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer your-slack-api-key" \
-d '{"presence": "away"}'
```

The last parameter `presence` can be `auto` or `away`. For example, if we set it as `away`, our slack status will be changed to `away` like below:

![](https://slack.zendesk.com/hc/article_attachments/360080995494)

> Official reference: [users.setPresence](https://api.slack.com/methods/users.setPresence)

## Update the status text and emoji

```bash
curl -X POST "https://slack.com/api/users.profile.set" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer your-slack-api-key" \
-d '{"profile": {"status_text": "unavailable", "status_emoji": "📴"}}'
```

The last parameter `status_text` and `status_emoji` can be any string and emoji. For example, if we set it as `unavailable` and `📴`, our slack status will be changed to `unavailable` and `📴` like below:

![Imgur](https://i.imgur.com/DXO9L6h.png)

> Official reference: [users.profile.set](https://api.slack.com/methods/users.profile.set)

## Conclusion

Using above apis with stream deck, we can change our slack status just in one click. It is very convenient and can improve our productivity.The slack API can do much more than just changing the status. You can also use it to send messages, create channels, and so on. If you are interested, you can check the official reference [here](https://api.slack.com/methods/).
