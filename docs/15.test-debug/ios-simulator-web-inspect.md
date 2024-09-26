---
title: Debug web app using xCode iOS Simulator
tags: [ios, simulator, safari]
---

## Why do we need to debug web app in iOS Simulator?

- Debug web app in mobile iphone environment
- Debug and test Progressive Web App (PWA) in iOS environment

## Prerequisites

- [xCode](https://developer.apple.com/xcode/) installed
- Mac or MacBook with [macOS](https://www.apple.com/macos/) installed

## Enable iOS Simulator in xCode

1. Open xCode
2. Go to `Xcode` > `Developer Tools` > `Simulator`

Then you can see the iOS Simulator window pop up.

## Debug web app in iOS Simulator

### Mobile simulator side

1. Open Safari in iOS Simulator
2. Go to the web app URL you want to debug

### Desktop side

1. Open Safari in your Mac
2. Go to `Develop`

Then we can see the iOS Simulator in the list like below:
![](https://i.imgur.com/isuMtZf.png)

3. Select the page under either `Safari` or `Service Worker`, then you will see a new dev tool window pop up.

> NOTE: `Safari` and `Service Worker` are the two different contexts, so you will need to select both of them if you want to inspect both contexts.
> ![](https://i.imgur.com/fD1kQOv.png)
