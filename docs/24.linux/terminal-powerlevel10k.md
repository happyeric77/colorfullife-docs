```bash
sudo apt update
sudo apt install zsh
```

## Install Oh My Zsh

```bash
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

When installing Oh My Zsh, it will ask you to change the default shell to zsh. Type `y` to change the default shell to zsh.

## Install Powerlevel10k

```bash
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
```

> Official doc: [https://github.com/romkatv/powerlevel10k?tab=readme-ov-file#oh-my-zsh](https://github.com/romkatv/powerlevel10k?tab=readme-ov-file#oh-my-zsh)

```bash
sudo vim ~/.zshrc
```

```bash title="~/.zshrc"
# delete-next-line
ZSH_THEME="robbyrussell"
# add-next-line
ZSH_THEME="powerlevel10k/powerlevel10k"
```

## Fonts

Powerlevel10k requires a set of fonts to display the icons correctly. Follow the [official doc](https://github.com/romkatv/powerlevel10k?tab=readme-ov-file#manual-font-installation) to install the fonts.

> NOTE: I am using MacOS to remote to the Ubuntu server, so I need to install the fonts on the MacOS side.

## Configure Powerlevel10k

Then, reopen the zsh terminal, it will ask you to configure the powerlevel10k theme. Follow the instructions to configure it.

```bash
  This is Powerlevel10k configuration wizard. You are seeing it because you haven't
  defined any Powerlevel10k configuration options. It will ask you a few questions and
                                 configure your prompt.

                    Does this look like a diamond (rotated square)?
                      reference: https://graphemica.com/%E2%97%86

                                     --->    <---

(y)  Yes.

(n)  No.

(q)  Quit and do nothing.

Choice [ynq]:

```

## Plugins

1. [zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions/blob/master/INSTALL.md)

Install the zsh-autosuggestions plugin:

```bash
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```

Add the plugin to the `~/.zshrc` file:

```bash

# delete-next-line
plugins=(git)
# add-next-line
plugins=(git zsh-autosuggestions)
```

After resource the `~/.zshrc` file `source ~/.zshrc`, the zsh-autosuggestions plugin will work.

2. [zsh-syntax-highlighting](https://github.com/zsh-users/zsh-syntax-highlighting/blob/master/INSTALL.md#oh-my-zsh)

Install the zsh-syntax-highlighting plugin:

```bash
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```

Add the plugin to the `~/.zshrc` file:

```bash
# delete-next-line
plugins=(git zsh-autosuggestions)
# add-next-line
plugins=(git zsh-autosuggestions zsh-syntax-highlighting)
```

After resource the `~/.zshrc` file `source ~/.zshrc`, the zsh-syntax-highlighting plugin will work.
