---
position: 1
---

# Git Config Alias

Git config alias is a command that allows you to create a shortcut for a long command. For example, if you want to create a shortcut for the git status command, you can use the following command:

```bash
git config --global alias.s status
```

The --global option allows you to set the alias for all repositories on your computer. If you want to set the alias for a specific repository, you can omit the --global option.

After you have created the alias, you can use the shortcut to run the command. For example, if you want to run the git status command, you can use the following command:

```bash
git s
```

The following table lists some of the most commonly used git config alias commands:

| Command                               | Description                                    |
| ------------------------------------- | ---------------------------------------------- |
| git config --global alias.s status    | Create a shortcut for the git status command   |
| git config --global alias.c commit    | Create a shortcut for the git commit command   |
| git config --global alias.a add       | Create a shortcut for the git add command      |
| git config --global alias.l log       | Create a shortcut for the git log command      |
| git config --global alias.co checkout | Create a shortcut for the git checkout command |
| git config --global alias.br branch   | Create a shortcut for the git branch command   |
| git config --global alias.r reset     | Create a shortcut for the git reset command    |
| git config --global alias.d diff      | Create a shortcut for the git diff command     |
| git config --global alias.st stash    | Create a shortcut for the git stash command    |
| git config --global alias.p pull      | Create a shortcut for the git pull command     |
| git config --global alias.pu push     | Create a shortcut for the git push command     |
| git config --global alias.m merge     | Create a shortcut for the git merge command    |
| git config --global alias.r rebase    | Create a shortcut for the git rebase command   |

## Config alias in .gitconfig

You can also create a shortcut for a git command by adding the following line to the .gitconfig file:

```config title="~/.gitconfig"
[alias]
    s = status
    c = commit
    a = add
    l = log
    co = checkout
    br = branch
    r = reset
    d = diff
    st = stash
    p = pull
    pu = push
    m = merge
    r = rebase
```

## Useful Git Config Alias tags

### --pretty

The --pretty option allows you to format the output of the git log command. For example, if you want to display the commit message in a single line, you can use the following command:

```bash
git log --pretty=oneline
```

The following table lists some of the most commonly used --pretty options:

| Option    | Description                                                                                        |
| --------- | -------------------------------------------------------------------------------------------------- |
| oneline   | Display the commit message in a single line                                                        |
| short     | Display the commit message in a single line with the commit hash and author                        |
| full      | Display the commit message in a single line with the commit hash, author, and date                 |
| fuller    | Display the commit message in a single line with the commit hash, author, date, and commit message |
| format:%s | Display the commit message in a single line with the commit hash and author                        |

In format:%s, %s is a placeholder for the commit message. You can use other placeholders to display other information. For example, if you want to display the commit hash and author, you can use the following command:

```bash
git log --pretty=format:"%h - %an, %ar : %s"
```

My favorite --pretty option example is the following command:

```title="~/.gitconfig"
lg = log --graph --pretty='format:"%C(yellow)%h %C(green)%d %C(blue)%ar %C(white)%s %C(magenta)(%cn)"'
```

The following image shows the output of the lg command:

![Git lg command output](/img/docImg/git-lg.png)

to sum up, it is a good practice to create a shortcut for a git command. It will save you a lot of time and effort.
