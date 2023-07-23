---
title: "package version [^ / ~]"
tags: [nodejs, npm]
---

In `package.json`'s `dependencies` section, we can see some packages are prefixed with `^` or `~`.

```json
{
  "dependencies": {
    "react": "^17.0.2",
    "react-dom": "^17.0.2",
    "react-scripts": "~4.0.3",
    "web-vitals": "^1.1.2"
  }
}
```

So what does `^` and `~` mean?

## `^`: Major version domain

```json
"dependencies": {
  "react": "^17.0.2"
}
```

It means that any version from 17.0.2 up to, but not including, 18.0.0 can be automatically installed when you run `npm install` or `npm update`. If 17.0.3, 17.1.0, or 17.9.5 is available, npm will update to the latest patch or minor version within the 17.x.x range.

## `~`: Minor version domain

```json
"dependencies": {
  "react": "~17.0.2"
}
```

It means that any version from 17.0.2 up to, but not including, 17.1.0 can be automatically installed when you run `npm install` or `npm update`. If 17.0.3 or 17.0.4 is available, npm will update to the latest patch version. If 17.1.0 is available, it won't update to that version since it represents the next minor version.
