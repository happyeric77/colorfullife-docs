---
title: Clean Code - Split function
tags: [style]
---

# Why should we split function?

When project keeps growing, some functions may become too long and hard to read. Why and how do we improve it. The answer is to split it into smaller functions.

BUT, HOW?

We should consider two points:

1. Does the function do more than one thing?
2. Do I repeat myself?

## Single Responsibility Principle

Function should do work that is related to its name. In other words, it should do work that's one level of abstraction below its name. It is an example:

```ts
const createUser = (name: string, email: string, password: string) => {
  // Below  highlighted code is lower level of abstraction than the function name
  // highlight-start
  if (!username || !email || !password) {
    throw new Error("Missing required fields");
  }
  // highlight-end

  const user = new User(name, email, password);
  const userRepo = new UserRepo();
  userRepo.save(user);
  return user;
};
```

In this case, we might want to split the highlighted code into a new function. It is because the function name is `createUser` but it also does validation. So we can split it into a new function called `isValidUser`.

```ts
const createUser = (name: string, email: string, password: string) => {
  // delete-start
  if (!username || !email || !password) {
    throw new Error("Missing required fields");
  }
  // delete-end

  // add-next-line
  isValidUser(name, email, password);

  const user = new User(name, email, password);
  const userRepo = new UserRepo();
  userRepo.save(user);
  return user;
};

// add-start
const isValidUser = (name: string, email: string, password: string) => {
  if (!username || !email || !password) {
    return throw new Error("Missing required fields");
  }
};
// add-end
```

## Stay DRY

The 2nd reason to split function is to avoid repeating repeated code. Also as known the most common reason to split function.

## Try keep function pure

pure function is a function that always return the same output given the same input. It is a good practice to keep function pure. It is because it is easier to test and debug. Also it is easier to understand the function.

If not necessary, we should avoid create side effect in function.

:::tip

**Side effect** is a function that change the state of the program or the outside world. For example:

- Changing the value of a global variable
- Writing data to a file
- output info to application
- ... etc

:::
