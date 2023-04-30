---
title: Type Infer
tags: [typescript]
---

# Real World Example of type infer

## What is type infer?

Typescript operator allows us to extract a type from another type. We can see an obvious example from the typescript built-in `ReturnType`:

```ts
ReturnType<T> = T extends (...args: any[]) => infer R ? R : any
```

This means that if passed in `T` is a function type, then the `R` type is the return type of the function. The it uses the conditional type `extends` to check if the `R` can be successfully extracted from `T`. If it can be extracted, then return `R` type. Otherwise, return `any` type.

As can be seen, the part `infer R` section allows us extracting a type (`R`) inside another type (`T`).

Another very common usage of `infer` operator is to extract the element type inside an array.

```ts
// Extract the element type inside an array
type ArrayElement<T extends Array<any>> = T extends Array<infer U> ? U : never;

// Example of number array
const numberArray = [1, 2, 3];
type ExtractedArrayType = ArrayElement<typeof numberArray>; // number

// Example of string array
const stringArray = ["a", "b", "c"];
type ExtractedStringArrayType = ArrayElement<typeof stringArray>; // string
```

In this article, we will use a more complex real world example to demonstrate how to use the `infer` operator when we want typescript to tell us what action parents will take according to the behavior of children.

The Our task is to have a `WhatParentShouldDo` type that represents what action parents will take according to the behavior of children.

```ts
// A child can call "mother" or "father" when he/she want to eat something.
type ChildCallMon = {
  call: "mother";
  wantToEat: CookFoodCategory;
};
type ChildCallDad = {
  call: "father";
  wantToEat: BuyFoodCategory;
};

// The behavior of children could be either "ChildCallMon" or "ChildCallDad"
type ChildrenBehavior = ChildCallMon | ChildCallDad;

// Parents can either cook food or buy food for children. But the type of food is different.
type DadBuyFood = (args: BuyFoodCategory) => void;
type BuyFoodCategory = "Humbugger" | "Pizza" | "Sushi";

type MomCookFood = (args: CookFoodCategory) => void;
type CookFoodCategory = "rice" | "noodle" | "soup";

type WhatParentShouldDo<T extends ChildrenBehavior> = TBD; // TODO: implement this type
```

In the above example, the child will call "mother" when he/she want to eat `CookFoodCategory` and call "father" when he/she want to eat `BuyFoodCategory`.

So, we then want to create a type `WhatParentShouldDo` that represents what action parents will take according to the behavior of children.

It is where the `infer` operator comes in handy.

## How infer operator works?

We will use the `infer` operator to implement the `WhatParentShouldDo` type. The `U` type in the following code is the type that we want to extract from the `ChildrenBehavior` type.
So the `U` type will be either "mother" or "father". Then we can use the conditional types to return the corresponding type:
When `U` is "mother", then return `MomCookFood` type. When U is "father", then return `DadBuyFood` type.

```ts
type WhatParentShouldDo<T extends ChildrenBehavior> = T extends { call: infer U }
  ? U extends "mother"
    ? MomCookFood
    : DadBuyFood
  : never;
```

We can start implementing the `WhatParentShouldDo` type. --> Dad's action and Mom's action.
Then finally we can implement the `parentAction` function that takes `ChildrenBehavior` as an argument.

```ts
const DadTakeAction: WhatParentShouldDo<ChildCallDad> = (args) => {
  console.log(`Dad is going out to buy ${args}`); // BuyFoodCategory
  // Do something to get task done
};
const MonTakeAction: WhatParentShouldDo<ChildCallMon> = (args) => {
  console.log(`Mom is going to cook ${args}`); // CookFoodCategory
  // Do something to get task done
};

const parentActionChecker = (args: ChildrenBehavior): args is ChildCallMon => {
  return args.call === "mother";
};

export const parentAction = (args: ChildrenBehavior) => {
  if (parentActionChecker(args)) {
    MonTakeAction(args.wantToEat);
  } else {
    DadTakeAction(args.wantToEat);
  }
};
```

In this case, we firstly use typescript **[User-defined type guard](user-defined type guard)** to implement a type guard function `parentActionChecker` that checks if the `ChildrenBehavior` is `ChildCallMon` type. Then we can use the type guard function in the `parentAction` and call the corresponding function.

Congratulations! We used many typescript features (user-defined type guard / conditional types / infer operator) to successfully implement this example. Hope this article helps you to understand more about `infer` operator in typescript.
