---
title: ERR Fatal bad object
position: 7
tags: [git, github]
---

# Error "fatal: bad object" when operating git repo

The following error message is displayed when you try to operate on a git repo:

```bash
$ git pull origin main
fatal: bad object refs/stash 2
error: github.com:<repo-dir>.git did not send all necessary objects
```

Then the first few lines in the output of `git fsck` command are:

```bash
$ git fsck
Checking object directories: 100% (256/256), done.
Checking objects: 100% (10872/10872), done.
# highlight-start
error: refs/stash 2: invalid shal pointer 0000000000000000000000000000000000000000
error: bad ref for .git/logs/refs/stash 2
# highlight-end
dangling tree 3a010523a022452dd6f42778108813486b958f
dangling commit ed8122864d791dd0b08a511553508960a52bee
dangling commit 1202d4a652fae5206b3ed3c1401da5e32c7d2d dangling commit 84820820a72c1a52ea812d5cce8855640f0ef12
# ...

```

To fix it, we will need to remove the bad ref `.git/refs/stash 2` and the corresponding log file `.git/logs/refs/stash 2`:

```bash
$ rm ".git/refs/stash 2"
$ rm ".git/logs/refs/stash 2"
```

Then run `git fsck` again to verify the repo, we will see the errors gone:

```bash
Checking object directories: 100% (256/256), done.
Checking objects: 100% (10872/10872), done.
dangling tree 3a010523a022452dd6f42778108813486b958f
dangling commit ed8122864d791dd0b08a511553508960a52bee
# ...
```

:::info
I see some people says the reason of the corruption is the operation is interrupted. In my case, it happened when I push a certain branch to the remote repo. 🥲
:::
