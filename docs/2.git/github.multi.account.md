---
title: Multiple GitHub SSH locally
position: 4
tags: [git, github]
---

# Multiple GitHub SSH locally

I started remotely working in 2019. I have two GitHub accounts: one for my personal projects and one for my work projects. I need to switch between the two accounts frequently.

Here is the steps I followed to set up multiple GitHub accounts on one computer:

## Set up SSH keys

I need to have two SSH keys: one for my personal account and one for my work account. I followed the steps below to generate the two SSH keys. See [Set up SSH for GitHub](github.ssh.md) for more details.

Once getting two ssh keys (~/.ssh/id_rsa & ~/.ssh/id_rsa_personal), and following the steps in [Set up SSH for GitHub](github.ssh.md) to upload the public keys to each Github account respectively. Then we need to set up the SSH config file:

1. Create a new file named `config` in the `~/.ssh` directory

2. Add the following content to the `config` file:

```config title="~/.ssh/config"
Host github.com-work
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_rsa

Host github.com-personal
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_rsa_personal
```

3. Save the file

# Ready to go

## Clone the repository using SSH with personal account

```bash
git clone git@github.com-personal:<github-account>/<repo-name>.git
```

## Clone the repository using SSH with work account

```bash
git clone git@github.com-work:<github-account>/<repo-name>.git
```

## Make sure that the remote URL is correct

```bash
git remote -v
```

It should show the following output for personal account:

```bash
git@github.com-personal:<github-account>/<repo-name>.git
```

It should show the following output for work account:

```bash
git@github.com-work:<github-account>/<repo-name>.git
```
