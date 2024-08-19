---
title: 'VS Code Server'
tags: ['vscode', 'ide']
---

If you have a home server very powerful running locally, you want to use it as a code server. There are two ways to do it:

Download a VS code in the client and connect to the server using vscode remote extension through ssh.

However, not all the client devices are available to install the vscode, especially those mobile devices. So, the second way is to use vscode server.

In this article, We will setup the local vscode server in the home server so that my mobile device can access it through the browser.

## Install VS code cli

As the home server is running Ubuntu server w/o GUI, we can install the vscode cli using snap.

```bash
sudo snap install code --classic
```

:::info

- Reference link: https://code.visualstudio.com/docs/setup/linux#_snap

:::

After installing the vscode cli, we can use the `code` command to open the vscode in the terminal.

## Create VS code server

We can create the vscode server using the following command:

```bash
code tunnel
```

If it is the first time to run the command, it will ask you to login with your github account. After that, it will create a tunnel to the vscode server.

<details>
<summary> Example output </summary>

```bash
eric@home-server-acer:~$ code tunnel
*
* Visual Studio Code Server
*
* By using the software, you agree to
* the Visual Studio Code Server License Terms (https://aka.ms/vscode-server-license) and
* the Microsoft Privacy Statement (https://privacy.microsoft.com/en-US/privacystatement).
*
[2024-08-19 08:45:16] info Using GitHub for authentication, run `code tunnel user login --provider <provider>` option to change this.
To grant access to the server, please log into https://github.com/login/device and use code BOBF-8XBF

```

Once the github auth is done, we can see below.

```bash
[2024-08-19 08:46:11] info Creating tunnel with the name: home-server
Open this link in your browser https://vscode.dev/tunnel/home-server
```

Now we can open the link in the browser to access the vscode server.

</details>

:::info

- Reference link: [https://vscode.dev.org.tw/docs/remote/tunnels#\_using-the-code-cli](https://vscode.dev.org.tw/docs/remote/tunnels#_using-the-code-cli)

:::

## persist the tunnel

If we want to persist the tunnel, we can use the following command:

```bash

code tunnel > code_tunnel_out 2> code_tunnel_err & disown

```

:::info

- `> code_tunnel_out` will redirect the stdout to the file `code_tunnel_out`
- `2> code_tunnel_err` will redirect the stderr to the file `code_tunnel_err`
- `& disown` will run the command in the background. The `disown` command is used after the `&` to remove the process from the shell's job table.

- reference link: [https://stackoverflow.com/questions/75805472/how-can-i-keep-code-tunnel-running-in-the-background](https://stackoverflow.com/questions/75805472/how-can-i-keep-code-tunnel-running-in-the-background)

:::
