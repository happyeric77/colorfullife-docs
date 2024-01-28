---
title: class dynamic inherit
tags: [typescript]
---

In this article, we will demonstrate the way to dynamically inherit a class in TypeScript.

To make it easy to understand, here it is the real world example:

> We are going to create an institution management system. the institution may be able to `lend`, `borrow`, or `spend` certain Item. for example, A inc. may lend or borrow cars. B inc. may lend or borrow books. C inc. may lend or borrow money.

```ts
type Amount = number;

class A {
  lendCar(): Amount {
    // logic
    return 1;
  }
  borrow(): Amount {
    // logic
    return 1;
  }
}

class B {
  lendBook(): Amount {
    // logic
    return 1;
  }
  borrow(): Amount {
    // logic
    return 1;
  }
}

class C {
  lendMoney(): Amount {
    // logic
    return 1;
  }
  borrowMoney(): Amount {
    // logic
    return 1;
  }
}
```

As you can see, the `lend` and `borrow` methods are duplicated in each class. So, we can extract them into a base class

```ts
type CarInc = IncIndustry<'car',  Amount>;
type BookInc = IncIndustry<'book' Amount>;
type MoneyInc = IncIndustry<'money' Amount>;

type IncType<T extends string, U> = Borrow<T, U> & Lend<T, U>;

type Borrow<T extends string, U> = [key in `borrow${Capitalize<T>}`]: U;
type Lend<T extends string, U> = [key in `lend${Capitalize<T>}`]: U;
// .. more

```

Then we can define our institution class like this:

```ts


class MyCompany implements CardInc & BookInc & MoneyInc {
  borrowCar(): Amount {
    // logic
    return 1;
  }
  lendCar(): Amount {
    // logic
    return 1;
  }
  borrowBook(): Amount {
    // logic
    return 1;
  }
  lendBook(): Amount {
    // logic
    return 1;
  }
  borrowMoney(): Amount {
    // logic
    return 1;
  }
  lendMoney(): Amount {
    // logic
    return 1;
  }
}
```
