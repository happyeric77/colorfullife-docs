---
title: Process Substitution
tags: [linux, process-substitution, shell-script]
---

Process substitution is a form of redirection where the input or output of a process (some sequence of commands) appear as a temporary file. This allows us to use the output of a command as a file.

## Types of Process Substitution

There are two types of process substitution:

1. **Process substitution with input**: `<()`
2. **Process substitution with output**: `>()`

## Process Substitution with Input

Process substitution with input is used to pass the output of a command as a file to another command. For example, to pass the output of `ls` command to `grep` command:

```bash
grep '.log'  <(ls)
```

<details>
<summary> Example </summary>

```bash
# Check the files in the current directory
❯ ls
exec.log  exec.sh

# Find all files with `.log` extension
❯ grep '.log'  <(ls)
exec.log
```

</details>

## Process Substitution with Output

Process substitution with output is used to pass the output of a command as a file to another command. For example, to pass the output of `echo` command to a file:

```bash

echo "Hello, World" > >(tee output.txt)
```

<details>
<summary> Example </summary>

```bash
# Execute the example command
❯ echo "Hello, World" > >(tee output.txt)
Hello, World

# Check the files in the current directory
❯ ls
exec.log  exec.sh  output.txt

# Check the content of the output file
❯ cat output.txt
Hello, World
```

</details>

:::tip
`tee` command is used to read from standard input and write to standard output and files.
:::
