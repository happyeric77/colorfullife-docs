---
title: GitHub SSH
position: 3
tags: [git, github]
---

# Access GitHub using SSH

If you want to use SSH to connect to GitHub, you can follow the steps below:

- Generate a new SSH key:

```bash
ssh-keygen
```

You will see there is a new file named `id_rsa` and `id_rsa.pub` in the `~/.ssh` directory.

- Add the SSH key to the ssh-agent:

  1. Get on to github.com and click on your profile picture on the top right corner. Then click on `Settings`

  2. Click on `SSH and GPG keys` on the left sidebar

  3. Click on `New SSH key` button

  4. Enter a title for the SSH key

  5. Copy the contents of the `id_rsa.pub` file and paste it into the `Key` field

  6. Click on `Add SSH key` button

- Set up the SSH config file:

  1. Create a new file named `config` in the `~/.ssh` directory

  2. Add the following content to the `config` file:

  ```config title="~/.ssh/config"
  Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_rsa
  ```

  3. Save the file

- Ready to go now:

  1. Clone the repository using SSH:

  ```bash
  git clone git@github.com:<github-account>/<repo-name>.git
  ```

  2. Push the changes to the remote repository:

  ```bash
  git push git@github.com:<github-account>/<repo-name>.git
  ```

  3. Pull the changes from the remote repository:

  ```bash
  git pull git@github.com:<github-account>/<repo-name>.git
  ```
