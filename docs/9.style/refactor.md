---
title: Way to structure/ refactor code
position: 3
tags: [style]
---

1. Write down the key points at the top (i.e. sorted array). Make having all the details. Show how organized you are. Better to have an example.

<details>
<summary>Example</summary>

```js title="Example"
// Given two arrays, create a function that let's a user know (true/false) whether these two arrays contain any common items
// For Example:
// const array1 = ['a', 'b', 'c', 'x'];
// const array2 = ['z', 'y', 'i'];
// should return false.
// -----------
// const array1 = ['a', 'b', 'c', 'x'];
// const array2 = ['z', 'y', 'x'];
// should return true.
```

</details>

2. Make sure to double check: What are the inputs? What are the outputs?

<details>
<summary>Example</summary>

```js title="Example"
// 2 parameters - arrays - no size limit
// return true or false
```

</details>

3. What is the most important value of the problem? Do you have time, and space and memory,
   etc.. What is the main goal?

<details>
<summary>Example</summary>

```js title="Example"
// Most important thing is to improve the time complexity
```

</details>

5. Start with the `naive`/ `brute force` approach. First thing that comes into mind. Think well and critically (don't need to write code yet, just organize it).

<details>
<summary>Example</summary>

```js title="Example"
// O(n^2): Nested for loop
```

</details>

6. Think deeper why this approach is not the best (i.e. O(n^2) or higher, not readable, etc...)

<details>
<summary>Example</summary>

```js title="Example"
// Nested for loop is not the best because it is O(n^2)
```

</details>

7. Walk through the approach, comment things and see where to break things.
   - List out unnecessary work
   - Ensure all information used
   - Bottleneck (This will be the main focus)
8. Before you start coding, walk through your code and write down the steps you are going to
   follow.
9. Modularize the code from the very beginning. Break up your code into beautiful small pieces
   and add just comments if you need to.

<details>
<summary>Example</summary>
To improve the O(n^2), we can break it down to O(a + b) instead of O(a * b). And list out the steps:

```js title="Example"
// 1. Loop through the first array and create hashMap
// 2. Loop through the second array and check if item in second array exists on the hashMap
// 3. If it exists in the second array, return true
```

</details>

10. Start actually writing your code now. the more getting prepared, the better the refactor will go. So never start coding
    without being sure of how things are going to work out.

<details>
<summary>Example</summary>

```js title="Example"
const findCommon = (array1, array2) => {
  const map = new HashMap();
  array1.forEach((item) => {
    if (!map.get(item)) {
      map.set(item, true);
    }
  });

  array2.forEach((item) => {
    if (map.get(item)) {
      return true;
    }
  });
};
```

</details>

11. Think about error checks and how can break the code. For example passing in the `null` as arg.

12. Don’t use bad/confusing names like i and j. Write code that reads well.

13. Finally, think where you would improve the code. Does it work? Are there
    different approaches? Is it readable? What would you google to improve? How can
    performance be improved?

<details>
<summary>Example</summary>

The previous approach solves the O(a \* b) problem, but it introduce a new problem of space complexity O(n)

So we might want to think how to improve the space complexity. We can do that by using the built-in `includes` method.

```js title="Example"
const findCommon = (array1, array2) => {
  return array1.some((item) => array2.includes(item));
};
// Using this approach, we can reduce the space complexity to O(1)
// And we keep the time complexity to O(a + b)
```

- [Reference reading](https://dev.to/lukocastillo/time-complexity-big-0-for-javascript-array-methods-and-examples-mlg)

</details>
