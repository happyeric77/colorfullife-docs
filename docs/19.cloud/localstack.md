---
title: Use localstack to mock aws services
tags: [cloudflare, worker]
---

## What is localstack

Localstack is a tool that allows you to mock aws services locally. It is very useful when you want to test your code locally without making real requests to aws.

## Pre-requisite

We need the following dependencies to get start with [localstack](https://github.com/localstack/localstack#installation).

- aws cli v2

> - [install](https://docs.aws.amazon.com/cli/latest/userguide/uninstall.html)
> - [uninstall](https://docs.aws.amazon.com/cli/latest/userguide/uninstall.html)

```bash title="example"
aws --version
aws configure
ls ~/.aws
```

- docker

## Install localstack

Install the local stack following the [localstack official doc](https://github.com/localstack/localstack#installation).

Ensure docker desktop is running.

Then run `localstack start -d`

![](https://imgur.com/kHwokmM)

Well, It is doable. However, This way we will need to add additional logic just for this legacy items. Personally I think, for long term, this redundant logic would make SDK unclean and difficult to follow. So I'd try to avoid it if it resolvable from user end.
And one another concern is that we would not know which chain was that users used to signup before. So I think it is better to let user to re-signup again.
