---
title: Git Reset
sidebar_position: 5
tags: [git, github]
---

# Git Reset

Git reset is a command that allows you to undo changes to a Git repository.
I primarily use it on the following scenarios:

## Scenario 1: Undoing a commit

If you have committed a change to a Git repository, but you want to undo the commit, you can use the following command:

```bash
git reset --soft HEAD^
```

The `--soft` option allows you to undo the commit, but keep the changes in the staging area. If you want to undo the commit and the changes, you can use the `--hard` option instead:

```bash
git reset --hard HEAD^
```

What I often do is using reset my HEAD to 1 commit ahead without the `--soft` or `--hard` option:

```bash
git reset HEAD^
```

This will reset my HEAD to 1 commit ahead, but keep the changes in the staging area.

Furthermore, if you want to undo the last 2 commits, you can use the following command:

```bash
git reset --soft HEAD~2
```

It becomes extremely useful if you work with a team and you do not want to make too many commits. especially when you rebase your branch to the latest master which might cause a lot of conflicts.

## Scenario 2: Undoing a staged change

If you have staged a change to a Git repository, but you want to undo the change, you can use the following command:

```bash
git reset staged-file
```
