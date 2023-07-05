---
title: Git Config Diff
sidebar_position: 2
tags: [git, github]
---

# Git Config Diff

Git config diff is a command that allows you to set the default diff tool for Git. For example, if you want to set the default diff tool to vimdiff, you can use the following command:

```bash
git config --global diff.tool vimdiff
```

The --global option allows you to set the diff tool for all repositories on your computer. If you want to set the diff tool for a specific repository, you can omit the --global option.

After you have set the diff tool, you can use the following command to run the diff tool:

```bash
git difftool file-or-commit-hax1 file-or-commit-hax2
```

Or setting diff as alias is also a good idea:

```bash
git config --global alias.d difftool
```

Then you can use the following command to run the diff tool:

```bash
git d file-or-commit-hax1 file-or-commit-hax2
```

You can set the alias in the .gitconfig file as well:

```config title="~/.gitconfig"
[alias]
    d = difftool --tool=vimdiff
```
