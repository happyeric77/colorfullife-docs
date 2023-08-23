---
title: white-space
tags: [css]
---

# What is white-space css property and how does it work

The `white-space` CSS property sets how white space and line break inside an element are handled.

There are 5 possible values for `white-space` property:

```css
white-space: normal | nowrap | pre | pre-line | pre-wrap;
```

|          | Wrapping | New line  | Spaces   |
| -------- | -------- | --------- | -------- |
| normal   | yes      | collapse  | collapse |
| nowrap   | no       | collapse  | collapse |
| pre      | no       | preserved | preserve |
| pre-line | yes      | preserved | collapse |
| pre-wrap | yes      | preserved | preserve |

## normal

- Collapses whitespace
- Collapses newlines
- Breaks lines only at the content is overflowing the container's width

## nowrap

- Collapses whitespace
- Collapses newlines
- Prevents the text from wrapping

## pre

- Preserves whitespace
- Preserves newlines
- Prevents the text from wrapping

## pre-line

- Preserves whitespace
- Preserves newlines
- Breaks lines only at the content is overflowing the container's width

## pre-wrap

- Preserves whitespace
- Preserves newlines
- Breaks lines at newlines, and as necessary to fill line boxes

## Example

![white-space-example](/img/docs-css-white-space.png)

<details>
<summary> Source code</summary>

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      .white-space-normal {
        width: 200px;
        background-color: aquamarine;
        white-space: normal;
      }
      .white-space-nowrap {
        width: 200px;
        background-color: aquamarine;
        white-space: nowrap;
      }
      .white-space-pre {
        width: 200px;
        background-color: aquamarine;
        white-space: pre;
      }
      .white-space-pre-line {
        width: 200px;
        background-color: aquamarine;
        white-space: pre-line;
      }
      .white-space-pre-wrap {
        width: 200px;
        background-color: aquamarine;
        white-space: pre-wrap;
      }
    </style>
    <title>Document</title>
  </head>
  <body>
    <h2>normal</h2>
    <!-- prettier-ignore -->
    <div class="white-space-normal">
      xxxx    
      Xxx 
      Xxx           xxxxx       xxxxxxxxxxxx
    </div>

    <h2>no-wrap</h2>
    <!-- prettier-ignore -->
    <div class="white-space-nowrap">
      xxxx    
      Xxx 
      Xxx           xxxxx      xxxxxxxxxxxx
    </div>

    <h2>pre</h2>
    <!-- prettier-ignore -->
    <div class="white-space-pre">
      xxxx    
      Xxx 
      Xxx           xxxxx      xxxxxxxxxxxx
    </div>

    <h2>pre-line</h2>
    <!-- prettier-ignore -->
    <div class="white-space-pre-line">
      xxxx    
      Xxx 
      Xxx           xxxxx      xxxxxxxxxxxx
    </div>

    <h2>pre-wrap</h2>
    <!-- prettier-ignore -->
    <div class="white-space-pre-wrap">
      xxxx    
      Xxx 
      Xxx           xxxxx      xxxxxxxxxxxx
    </div>
  </body>
</html>
```

</details>
