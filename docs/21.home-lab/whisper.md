---
title: Build a self hosted speech to text server using Whisper
tags: [api, iot, home-assistant]
---

Whisper is a general-purpose speech recognition model introduced by OpenAi. It is trained on a large dataset of diverse audio and is also a multi-task model that can perform multilingual speech recognition as well as speech translation and language identification.

> [Whisper github](https://github.com/openai/whisper)

In this article, we are going to host a local spe ech recognition server using `Whishper` powered by `whisper`

> INFO:
> Github - [pluja/whishper](https://github.com/pluja/whishper) > [Documentation](https://whishper.net/guides/install/)

## Installation

We will be using `docker` and `docker-compose` to host the server. Make sure you have both installed on your machine.

### Option 1 (recommended)

We can simply run the shell script which automatically set up all necessary configurations and dependencies.

# Get the script

```
curl -fsSL -o get-whishper.sh https://raw.githubusercontent.com/pluja/whishper/main/get-whishper.sh

```

> **INFO**: script brackdown
>
> - [check docker installation](# Check if docker is installed). If not, try install.
> - [Confirm the docker volume location](# Ask if user wants to get everything in the current directory or in a new directory)
> - [If .env not exist, create a default one](# check if .env exists)
> - Finally generate all the dependencies and run docker compose

Then we can access the server on `http://ip-address:8082`

:::warning

You may run into the issue below if you try to access the server from different origin because by default, it allows only local host only accessable.

```bash
cat transcription.err.log
An error occured while synchronizing the model Systran/faster-whisper-tiny from the Hugging Face Hub:
Cannot find an appropriate cached snapshot folder for the specified revision on the local disk and outgoing traffic has been disabled. To enable repo look-ups and downloads online, pass 'local_files_only=False' as input.
Trying to load the model directly from the local cache, if it exists.
/usr/local/lib/python3.11/site-packages/huggingface_hub/file_download.py:1204: UserWarning: `local_dir_use_symlinks` parameter is deprecated and will be ignored. The process to download files to a local folder has been updated and do not rely on symlinks anymore. You only need to pass a destination folder as`local_dir`.
For more details, check out https://huggingface.co/docs/huggingface_hub/main/en/guides/download#download-files-to-local-folder.
  warnings.warn(
An error occured while synchronizing the model Systran/faster-whisper-small from the Hugging Face Hub:
Cannot find an appropriate cached snapshot folder for the specified revision on the local disk and outgoing traffic has been disabled. To enable repo look-ups and downloads online, pass 'local_files_only=False' as input.

```

To fix it, we will need to change the `WHISHPER_HOST` in the `.env` file to `0.0.0.0:8082` and restart the server.

```bash
# add-next-line
WHISHPER_HOST=your-whishper-server-ip:8082
# delete-next-line
WHISHPER_HOST=127.0.0.1:8082
```

And recreate the docker container.

```bash
sudo docker compose up -d
# Do not use restart, restart does not apply the docker-compose file change
```

- Reference: [Doc](https://whishper.net/troubleshooting/transcriptions-not-working/)

:::

### Option 2

We can also set up everything by ourself

First, clone the repository and navigate into the directory using the following command

```bash
git clone https://github.com/pluja/whishper.git
cd whishper
```

Now, create a `.env` file and edit it

```bash
# Libretranslate Configuration
## Check out https://github.com/LibreTranslate/LibreTranslate#configuration-parameters for more libretranslate configuration options
LT_LOAD_ONLY=es,en,fr

# Whisper Configuration
WHISPER_MODELS=tiny,small
WHISHPER_HOST=http://0.0.0.1:8082

# Database Configuration
DB_USER=whishper
DB_PASS=whishper
```

You can change the port and model as per your requirement. The model can be one of `tiny`, `base`, `small`, `medium`, `large`.

After the setup is done, we can simply start the server using `docker-compose`

```bash
docker-compose up -d
```
