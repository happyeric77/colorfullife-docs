---
title: Git Tag
position: 6
tags: [git, github]
---

# Git Tag

Git tag is a command that allows you to add a tag to a commit. For example, if you want to add a tag named v1.0.0 to the latest commit, you can use the following command:

```bash
git tag v1.0.0
```

It is often used when it comes to publishing a new version of the project especially when you have an open source npm package. You can use the tag to mark the commit that you want to publish to npm. Most of the modern npm monorepos have built-in scripts that automatically tag the latest commit when you publish a new version to npm.

There are few options I personally use when it comes to tagging a commit:

## git tag -a <tag_name> -m <tag_message>

The `-a` option allows you to add a tag message. For example, if you want to add a tag message to the tag named v1.0.0, you can use the following command:

```bash
git tag -a v1.0.0 -m "Release v1.0.0"
```

## git tag -f <tag_name>

The `-f` option allows you to force the tag. For example, if you want to force the tag named v1.0.0, you can use the following command:

```bash
git tag -f v1.0.0
```

## git tag -d <tag_name>

The `-d` option allows you to delete the tag. For example, if you want to delete the tag named v1.0.0, you can use the following command:

```bash
git tag -d v1.0.0
```

## git tag -l

The `-l` option allows you to list the tags. For example, if you want to list all the tags, you can use the following command:

```bash
git tag -l
```

All those option above can only make effect locally. If you want manipulate the tags on the remote repository, you can use the following commands.

# Git tag for remote repository

## git push --tags

The `git push --tags` command allows you to push all the tags to the remote repository.

## git pull --tags

The `git pull --tags` command allows you to pull all the tags from the remote repository.

## git push origin <tag_name>

The `git push origin <tag_name>` command allows you to push a specific tag to the remote repository. For example, if you want to push the tag named v1.0.0 to the remote repository, you can use the following command:

## git push --delete origin <tag_name>

The `git push --delete origin <tag_name>` command allows you to delete a specific tag from the remote repository. For example, if you want to delete the tag named v1.0.0 from the remote repository, you can use the following command:
