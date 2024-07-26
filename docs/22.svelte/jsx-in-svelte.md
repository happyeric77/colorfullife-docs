---
title: Use React components in Svelte
tags: [svelte, react]
---

Svelte is a not only a framework but also a compiler that compiles the Framework code into vanilla JavaScript. It also supports JSX syntax, which is a syntax that React uses to create components.
This means that we should be able to use React components in Svelte as long as we have the following dependencies installed in our project.

## Prerequisites

```json title="package.json"
{
  "dependencies": {
    "react": "^17.0.2",
    "react-dom": "^17.0.2"
  },
  "devDependencies": {
    //...
  }
}
```

## Approach 1: Using Native React components

We will need to create a `.svelte` wrapper component that will render the React component. This is because Svelte does not understand React components directly. example below:

```svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import React from 'react';
  import ReactDOM from 'react-dom/client';
  import {NotifiCardModalWrapper} from "../NotifiCardModalWrapper"; // This wrapper is just a normal tsx component

  let root: ReactDOM.Root;

  let notifiCardModalReactComponent: ReactDOM.Container;


  const renderNotifiCardModal = (notifiCardModalReactComponent: ReactDOM.Container) => {
    root = ReactDOM.createRoot(notifiCardModalReactComponent)
    root.render(React.createElement(NotifiCardModalWrapper, {}, null))
  }

  onMount(() => {
    renderNotifiCardModal(notifiCardModalReactComponent )
  });

  onDestroy(() => {
    if (root) {
      root.unmount(); // Use the unmount method on the root
    }
  });

</script>
<div bind:this={notifiCardModalReactComponent}></div>
```

## Approach 2: Using 3rd party libraries

We have multiple libraries out there that can help us to use React components in Svelte. ex. `react-svelte`, `svelte-react`, `vite-plugin-svelte-bridge` or `svelte-adapter` and . `svelte-preprocessor-react`.

After digging into the documentation of these libraries, all off them does not provide the feature to use React context but `svelte-preprocessor-react`.

In our use case, we not only need to use the React component but also the React context to directly access core services in Dapp level. So the `svelte-preprocessor-react` is the best choice for us.

## Evaluate the approach

| Criteria           | Approach 1 | Approach 2 |
| ------------------ | ---------- | ---------- |
| **Complexity**     | High       | Low        |
| **Performance**    | mid        | mid        |
| **Flexibility**    | high       | high       |
| **Learning curve** | High       | Low        |

1. **Complexity**: Approach 1 is more complex because we will need to generate many redundant code to simulate the React component life cycle in Svelte.

2. **Performance**: Both approaches have the same performance because they are using the same React component. Svelte is just to compile the React component. The only difference could be that the Approach 2 might have slightly bigger bundle size (only 50.kB unpacked Size does not really have impact of the performance).

3. **Flexibility**: Both approaches can be supper flexible to use almost all React feature. SSR, React context, React hooks, etc.

4. **Learning curve**: Approach 1 has a higher learning curve because we will need to have very deep understanding of Svelte framework to do the right thing. Approach 2 is more straightforward because it is just like using React in React.

## Conclusion

If we plan to use React components in Svelte for a POC with more clean and readable code, we will consider to use the `svelte-preprocessor-react` library.

## References

- [npm: svelte-preprocessor-react](https://www.npmjs.com/package/svelte-preprocess-react)
- [github: svelte-preprocessor-react](https://github.com/bfanger/svelte-preprocess-react)
