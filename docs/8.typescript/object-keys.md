---
title: "Object.keys with typescript"
tags: [typescript]
---

A common issue when using `Object.keys` with typescript is that the type of the returned array is `string[]` instead of the correct type of the object's keys. This makes it impossible to use the returned array to access the object's properties.

Here it is a example of this issue:

```ts
// Declare an object
const unConfirmedTargets = {
  email: false,
  phoneNumber: true,
  telegram: false,
  discord: true,
};

// Get the object's keys and manipulate them.
Object.keys(unConfirmedTargets)
  .map((key) => {
    if (unConfirmedTargets[key]) {
      return key;
    }
  })
  .filter((item): item is FormField => !!item);
```

Then we will get the following error:

```bash
Element implicitly has an 'any' type because expression of type 'string' can't be used to index type '{ email: boolean; phoneNumber: boolean; telegram: boolean; discord: boolean; }'.

No index signature with a parameter of type 'string' was found on type '{ email: boolean; phoneNumber: boolean; telegram: boolean; discord: boolean; }'.ts(7053)
```

The reason is that the type of `Object.keys(unConfirmedTargets)` is `string[]`. Typescript does not know that the keys explicitly.

To fix this, we can create a helper:

```ts
/**
 * @description Returns an array of the object's keys with the correct type.
 * @example
 * const destinations: Record<FormField, string> = { email: 'email', phoneNumber: 'phoneNumber' };
 * const keys = objectKeys(destinations); // type of Keys is FormField[] instead of string[] (which is the default type of Object.keys)
 */
export const objectKeys = <T extends Record<keyof T, unknown>>(
  object: T
): (keyof T)[] => {
  return Object?.keys(object) as (keyof T)[];
};
```

## Advanced usage

Say we have a parsed markdown html that we want to override the style of some html tags. We can do it like this:

In this case, we need to use `Object.keys` to get the keys of the object `markdownHtmlAttrs` and then use `forEach` to iterate over the keys. This is where the `objectKeys` helper comes in handy.

Just like this:

```ts
const markdownHtmlAttrs = {
  a: "class='cursor-pointer text-wosmongton-300 transition-all duration-[0.2s] hover:text-osmoverse-200' target='_blank' ",
  li: "class='list-disc list-inside'",
};

const overrideMarkdownHtmlStyle = (htmlMessage: string) => {
  let updatedHtmlMessage = htmlMessage;
  objectKeys(markdownHtmlAttrs).forEach((tag) => {
    updatedHtmlMessage = updatedHtmlMessage.replace(
      new RegExp(`<${tag}`, "g"),
      `<${tag} ${markdownHtmlAttrs[tag]}`
    );
  });
  return updatedHtmlMessage;
};
```

Otherwise, we will need to cast the type of `Object.keys` to `(keyof typeof markdownHtmlAttrs)[]` like this, which is not as clean as the `objectKeys` helper:

```ts
const markdownHtmlAttrs = {
  a: "class='cursor-pointer text-wosmongton-300 transition-all duration-[0.2s] hover:text-osmoverse-200' target='_blank' ",
  li: "class='list-disc list-inside'",
};

const overrideMarkdownHtmlStyle = (htmlMessage: string) => {
  let updatedHtmlMessage = htmlMessage;
  Object.keys(markdownHtmlAttrs).forEach((tag) => {
    updatedHtmlMessage = updatedHtmlMessage.replace(
      new RegExp(`<${tag}`, "g"),
      `<${tag} ${markdownHtmlAttrs[tag as keyof typeof markdownHtmlAttrs]}`
    );
  });
  return updatedHtmlMessage;
};
```
