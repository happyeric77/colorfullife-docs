---
title: Clean Code - Cohesion
tags: [style]
---

# How to write clean OOP code

In this section, I will share some tips on how to write clean OOP code. It is not a complete guide but it is a good start.

We will begin from the following concepts:

- Cohesion and why we should increase it as much as possible
- Law Of Demeter
- SOLID

## What is Cohesion and why should we care?

Cohesion is a measure of how related the responsibilities of a class are. It is a measure of how strongly related and focused the various responsibilities of a class are. In other words, it is a measure of how much a class is about one thing or how much a class does one thing.

To make it simple, Cohesion is how much are the class methods using the class properties.

- Maximum Cohesion: All methods use all properties

- No Cohesion: No methods use any properties, Normally it is a utility class or a data container

:::info

Data container is a class that only contains properties and no methods. It is normally used to pass data between layers.

:::

## What is Law Of Demeter and why should we care?

The Law of Demeter, also known as the principle of least knowledge, is a design guideline in object-oriented programming (OOP) that promotes loose coupling between objects. It states that an object should have limited knowledge or dependencies on other objects and should only interact with its immediate neighbors.

The key idea behind the Law of Demeter is to minimize the knowledge that an object needs to have about the structure and behavior of other objects in the system. It encourages encapsulation and information hiding, which are fundamental principles in OOP. By limiting the interactions to only the necessary collaborators, the Law of Demeter helps reduce the dependencies and potential side effects caused by changes in other parts of the system.

According to the Law of Demeter, an object should only directly interact with:

- Its own methods.
- Its own attributes.
  Method parameters.
- Objects it creates.
- Objects passed to it as method arguments.
- Objects associated with its own attributes.

In other words, an object should avoid accessing the internals of other objects, such as calling methods on objects retrieved through intermediary objects or accessing nested object structures. Instead, it should rely on a limited set of interfaces to accomplish its tasks.

By adhering to the Law of Demeter, code becomes more modular, maintainable, and less tightly coupled. It enhances code readability, improves testability, and facilitates changes to the system by reducing the ripple effects caused by modifications in one part of the codebase.

It's important to note that the Law of Demeter is a guideline and not a strict rule. Depending on the context, there may be cases where violating the law could be acceptable or necessary, but in general, following its principles leads to better software design.

See the following example:

```ts
class Customer {
  lastPurchase: any;

  getLastPurchaseDate() {
    return this.lastPurchase.date;
  }
}

class DeliveryJob {
  customer: any;
  warehouse: any;

  constructor(customer, warehouse) {
    this.customer = customer;
    this.warehouse = warehouse;
  }

  deliverLastPurchase() {
    // Should not access the properties of the customer object
    // delete-next-line
    const date = this.customer.lastPurchase.date;

    // The following two lines are fine, but they are not the best.
    // delete-start
    const date = this.customer.getLastPurchaseDate();
    this.warehouse.deliverPurchasesByDate(this.customer, date);
    // delete-end
    // We should `TELL DON'T ASK`
    this.warehouse.deliverPurchase(this.customer.lastPurchase);
  }
}
```

> [Source](https://github.com/academind/clean-code-course-code/blob/obj-05-law-of-demeter/law-of-demeter.ts)

To be continued...
