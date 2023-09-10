---
title: Git bisect
sidebar_position: 10
tags: [git, github]
---

# Git bisect

## What is git bisect

`git bisect` is a command that helps you find the commit that introduced a bug. It does this by using a binary search algorithm to find the commit that introduced the bug.

## How to use git bisect

### Start bisect

Use the following command to start bisect:

```bash
git bisect start
```

It brings us to the interact terminal mode. We then need to tell git which commit is the good one and which one is the bad one by typing

```bash
git bisect good <commit>
git bisect bad <commit>
```

Then afterward, git will use a binary search algorithm to suggest us to check if a certain commit is good or bad until it finds the commit that introduced the bug.

Finally, we can use exit the bisect mode by using `git bisect reset`. Then use `git diff` to check the difference between the the commit that introduced the bug and the one before it (does not have the bug).

🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉

:::info
Checkout the following video to see how to use git bisect in action.

<iframe width="560" height="315" src="https://www.youtube.com/embed/ah2wZank-g8?si=u2GJ052d1jqrTPKd" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

:::
