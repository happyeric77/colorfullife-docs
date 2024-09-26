---
title: Redirection and Stream
tags: [linux, stream, redirection]
---

## Real World Example

Log in to the server using SSH, say if we want to find all log files in the server, we can use the following command:

```bash
find / -name '*.log' > /path/to/logfile.log
```

This way, all the output of `find / -name '*.log'` will be redirect to `logfile.log` file.

However, the certain logged in user may not have the permission to access all the files, using above command will result in putting not only the accessible files but also the error message to the `logfile.log`. To avoid it, we can use

```bash
find / -name '*.log' 2> /dev/null
```

:::tip
`2> /dev/null` is used to redirect the error message to `/dev/null`, which means the error message will not be displayed.
:::

## Linux Stream

- stander input（stdin）： 0, usually input from the keyboard.
- stander output（stdout）： 1, usually output to the terminal, used to output normal information.
- stander error（stderr）： 2, usually output to the terminal, used to output error information.

:::info

**About `/dev/null`**
`/dev/null` is a special file in Unix-like operating systems that discards all data written to it but reports that the write operation succeeded. It provides essentially the same functionality as a black hole on a filesystem.

**Redirection and &1 and &2**

File descriptor 1 is the standard output (stdout).
File descriptor 2 is the standard error (stderr).

At first, 2>1 may look like a good way to redirect stderr to stdout. However, it will actually be interpreted as "redirect stderr to a file named 1".

& indicates that what follows and precedes is a file descriptor, and not a filename. Thus, we use 2>&1. Consider >& to be a redirect merger operator.

:::
