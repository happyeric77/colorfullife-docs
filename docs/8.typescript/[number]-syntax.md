---
title: ”[number]” syntax
tags: [typescript]
---

# What is the [number] syntax?

The [number] syntax is a TypeScript syntax that allows you to retrieve the type of an array's elements.

## Example#1

```typescript
type Numbers = number[];
type Number = Numbers[number]; // type Number = number
```

## Example#2

```typescript
type Strings = string[];
type String = Strings[number]; // type String = string
```

So, the [number] syntax is used to retrieve the type of a specific array element. In this case, it retrieves the type of the first array element (since number is 0 by default).
