---
title: Wheel event propagate
tags: [vite, vue, npm]
---

# Wheel event propagate

Most of web frontend dev has come across the problem that the wheel event is propagated to the parent element when the scroll bar reaches the end.

In this article, we are going to talk about how to prevent the wheel event from propagating to the parent element.

## The problem

As can be seen in the following example, there are two components in the body.

1. container (parent)
2. inner-container (child)

When the scroll bar of the inner-container reaches the end, the wheel event is propagated to the parent element. This is a very annoying problem.

![](/img/docs-browser-wheel-event-propragate.png)

I was thinking it was cased by `scroll` event, after a deep look. I realized that `scroll` event does propagate by default. The reason is actually from the `wheel` event.

## The solution

We can use `e.preventDefault()` to prevent the wheel event from propagating to the parent element in certain conditions.

1. When the scroll bar is at the top, prevent the wheel event from default behavior.
2. When the scroll bar is at the bottom, prevent the wheel event from default behavior.

See the source code below. You can also copy the code and try it out.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body {
        background-color: #000;
        color: #fff;
        display: flex;
        height: 100vh;
        justify-content: center;
        align-items: center;
      }
      .container {
        width: 50%;
        height: 50%;

        background-color: lightcoral;
        overflow-y: scroll;
      }
      .inner-container {
        width: 200px;
        height: 100px;
        position: absolute;
        background-color: lightblue;
        overflow-y: scroll;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="inner-container">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Velit quas
        delectus distinctio? Quo vitae quas recusandae! Vitae atque ratione
        accusamus dolores mollitia, architecto velit minus quam repellat? Enim,
        sequi tenetur! Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        Eaque, aliquid deleniti? Suscipit, accusamus dignissimos dolores quo
        dolorum fuga enim asperiores voluptas sequi eveniet officia laborum
        recusandae commodi harum totam perferendis! Lorem ipsum dolor sit amet
        consectetur adipisicing elit. Laborum odit quis voluptatem facilis sit
        culpa suscipit rerum. Iure hic, odio, quam suscipit repellat in
        laboriosam possimus, deserunt maxime voluptatibus molestiae. Lorem ipsum
        dolor sit amet consectetur adipisicing elit. Voluptatum asperiores sint
        fugit assumenda officia ratione. Nobis quis officiis ipsam fugit unde
        maiores
      </div>
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Velit quas
      delectus distinctio? Quo vitae quas recusandae! Vitae atque ratione
      accusamus dolores mollitia, architecto velit minus quam repellat? Enim,
      sequi tenetur! Lorem ipsum dolor sit amet, consectetur adipisicing elit.
      Eaque, aliquid deleniti? Suscipit, accusamus dignissimos dolores quo
      dolorum fuga enim asperiores voluptas sequi eveniet officia laborum
      recusandae commodi harum totam perferendis! Lorem ipsum dolor sit amet
      consectetur adipisicing elit. Laborum odit quis voluptatem facilis sit
      culpa suscipit rerum. Iure hic, odio, quam suscipit repellat in laboriosam
      possimus, deserunt maxime voluptatibus molestiae. Lorem ipsum dolor sit
      amet consectetur adipisicing elit. Voluptatum asperiores sint fugit
      assumenda officia ratione. Nobis quis officiis ipsam fugit unde maiores
      fuga. Fugit cumque magni laborum amet, corporis ullam? Lorem ipsum dolor
      sit amet consectetur adipisicing elit. Eligendi, quasi? Nobis recusandae
      eius explicabo! Facilis totam molestiae delectus nemo, ratione neque?
      Maiores quo laboriosam dicta odit quod doloribus, sit modi? Lorem ipsum,
      dolor sit amet consectetur adipisicing elit. Labore inventore placeat quo
      ratione perspiciatis magni, nobis tempore quisquam facere quis
      consequuntur amet consequatur? Laborum necessitatibus vitae voluptate,
      corporis iste voluptas. Lorem ipsum dolor, sit amet consectetur
      adipisicing elit. Velit quas delectus distinctio? Quo vitae quas
      recusandae! Vitae atque ratione accusamus dolores mollitia, architecto
      velit minus quam repellat? Enim, sequi tenetur! Lorem ipsum dolor sit
      amet, consectetur adipisicing elit. Eaque, aliquid deleniti? Suscipit,
      accusamus dignissimos dolores quo dolorum fuga enim asperiores voluptas
      sequi eveniet officia laborum recusandae commodi harum totam perferendis!
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum odit quis
      voluptatem facilis sit culpa suscipit rerum. Iure hic, odio, quam suscipit
      repellat in laboriosam possimus, deserunt maxime voluptatibus molestiae.
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum
      asperiores sint fugit assumenda officia ratione. Nobis quis officiis ipsam
      fugit unde maiores fuga. Fugit cumque magni laborum amet, corporis ullam?
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi, quasi?
      Nobis recusandae eius explicabo! Facilis totam molestiae delectus nemo,
      ratione neque? Maiores quo laboriosam dicta odit quod doloribus, sit modi?
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Labore inventore
      placeat quo ratione perspiciatis magni, nobis tempore quisquam facere quis
      consequuntur amet consequatur? Laborum necessitatibus vitae voluptate,
      corporis iste voluptas.
    </div>
  </body>
  <script>
    document.getElementsByClassName("inner-container")[0].addEventListener(
      "wheel",
      (e) => {
        const innerContainer =
          document.getElementsByClassName("inner-container")[0];
        console.log(
          innerContainer.scrollTop,
          innerContainer.scrollHeight,
          innerContainer.offsetHeight
        );
        // highlight-start
        /** Condition#1: When the scroll bar is at the top, prevent the wheel event from default behavior.
         * - e.deltaY < 0: scroll up
         * - innerContainer.scrollTop === 0: scroll bar is at the top
         * */
        if (e.deltaY < 0 && innerContainer.scrollTop === 0) {
          e.preventDefault();
        }
        // highlight-end

        // highlight-start
        /** Condition#2: When the scroll bar is at the bottom, prevent the wheel event from default behavior.
         * - e.deltaY > 0: scroll down
         * - innerContainer.scrollTop >= innerContainer.scrollHeight - innerContainer.offsetHeight: scroll bar is at the bottom
         */
        if (
          e.deltaY > 0 &&
          innerContainer.scrollTop >=
            innerContainer.scrollHeight - innerContainer.offsetHeight - 0.5
        ) {
          e.preventDefault();
        }
        // highlight-end
      },
      { passive: false }
    );
  </script>
</html>
```

## Reference

- - [stakeoverflow](https://stackoverflow.com/questions/5802467/prevent-scrolling-of-parent-element)
