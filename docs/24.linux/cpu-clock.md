---
title: CPU clock speed
tags: [linux, system]
---

We are able to understand the cpu current speed and adjust it to the desired speed. Here is how we can do it:

1. Install `cpufrequtils` package:

   ```bash
   sudo apt install cpufrequtils
   ```

2. Check the current cpu speed and cpu frequencies:

   ```bash
   cpufreq-info
   ```

3. Check the available governors:

   ```bash
   cpufreq-info -g
   ```

:::tip

If you do not have `userspace` governor, you will not be able to set the cpu speed specifically.

:::

4. Change the governor to `powersave`:

   ```bash
   sudo cpufreq-set -r -g powersave
   ```

:::info
-r: Apply the change to all CPUs
-g: Set the governor
:::
