---
title: User-defined type guard
tags: [typescript]
---

# Simple example of using user-defined type guard to filter out undefined

If you are coming from Javascript to Typescript, you must have come across the situation that you want to filter out `undefined` from an array. However, the type of the array is still `T | undefined` after filtering even though we know that the array does not contain `undefined` anymore.
Checkout the simple example below:

```ts
type Foo = {
  a: string;
  b: number;
};

const UnfilteredFoos: (Foo | undefined)[] = [{ a: "a", b: 1 }, undefined, { a: "b", b: 2 }];

const filteredFoos = UnfilteredFoos.filter((foo) => !!foo); // filteredFoos is still Foo | undefined
```

The [reason](https://github.com/microsoft/TypeScript/issues/45097) is that Typescript does not know the exact type from the return value of `filter` function which is only a `boolean` type.
So we need to tell typescript more explicitly by passing a user-defined type guard function to the `filter` function.

```ts
const filteredFoos = UnfilteredFoos.filter((foo): foo is Foo => !!foo); // filteredFoos is Foo[]
```

It means we tell typescript that if the `!!foo` is true, then the type of `foo` is `Foo`.
