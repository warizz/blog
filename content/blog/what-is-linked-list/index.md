---
title: What is linked list?
date: 2019-01-23
tldr: It is simple but I don't know how I'm going to use it in real life.
langs: ['en', 'th']
---

Recently, I got an inspiration from reading [I interviewed at five top companies in Silicon Valley in five days, and luckily got five job offers](https://medium.com/@XiaohanZeng/i-interviewed-at-five-top-companies-in-silicon-valley-in-five-days-and-luckily-got-five-job-offers-25178cf74e0f) and [other](https://news.ycombinator.com/item?id=18931129) [comments](https://news.ycombinator.com/item?id=11579757) from [Hacker News](https://news.ycombinator.com) that we--programmers--should know some algorithms or data structures so we can know when and how to use them by heart instead of using only brute force. We don't even need to remember how to implement them but we should know what *keyword* to search for.

When I was in college, *linked list* was a forbidden word for me and some of my friends (we made disgusting face when we heard the word) because I didn't understand it one bit (I did not pay attention to school much that time.). Just a few years ago, I bought an Udemy course name [Learning Data Structures in JavaScript from Scratch](https://www.udemy.com/learning-data-structures-in-javascript-from-scratch/) (not advertising) which linked list is one of its lectures. After finished the course, I realized that it isn't hard to understand at all, actually, it is super simple! So--to lift my long time curse--I would like to start my algorithm series with it.

## Definition

From [Wikipedia](https://en.wikipedia.org/wiki/Linked_list)
> In computer science, a Linked list is a linear collection of data elements, (...) each element points to the next. It is a data structure consisting of a collection of nodes which together represent a sequence. In its most basic form, each node contains: data, and a reference (in other words, a link) to the next node in the sequence.

From [GeeksforGeeks](https://www.geeksforgeeks.org/data-structures/linked-list/)
> A linked list is a linear data structure, (...) The elements in a linked list are linked using pointers (...)

From my understanding, linked list is **a data structure that consist of nodes linked together into linear line which each node can only reference to its next node.**

## When to use

For my entire programming life, I never have a chance to implement linked list into any code base. So, I would only summary its benefits from what I just googled.

- It can add/ delete data more efficiently than array in some case <sup>[1]</sup>.
```js{5,7}
Algorithm           ArrayList   LinkedList
seek front            O(1)         O(1)
seek back             O(1)         O(1)
seek to index         O(1)         O(N)
insert at front       O(N)         O(1)
insert at back        O(1)         O(1)
insert after an item  O(N)         O(1)
````
- It has more flexibility in memory management <sup>[2]</sup>.

In conclusion, if you're not writing low-level code, you wouldn't have to write any linked list at all.

## ​Example

<a href="https://repl.it/@warizz/NodeJsLinkedList" target="\_blank" rel="noreferrer noopener">Full code example</a>

This is an example of *doubly* linked list which have 2 references in a node, next and previous. (*singly* type only have reference to next node).

Let's start with `Node` class, we store data in `value` and keep sibling node references in `next` and `prev`.

```js
function Node(value, next, prev) {
  this.value = value;
  this.next = next;
  this.prev = prev;
}
```

And `LinkedList` class that only store a reference of head and tail node.

```js
function LinkedList() {
  this.head = null;
  this.tail = null;
}
```

Then we add `addToHead` function to `LinkedList`.

```js
LinkedList.prototype.addToHead = function addToHead(value) {
  const _node = new Node(value, this.head, null);
  if (this.head) {
    this.head.prev = _node;
  } else {
    this.tail = _node;
  }
  this.head = _node;
}
```

Inside the function, we instantiate new node from `Node` class and assign former head's reference into `next` of new head.
```js
var _node = new Node(value, this.head /* next */, null);
```

If `head` exists (it will be `null` in every newly created `LinkedList`), we assign its `prev` with new head bacause new head is going to be previous to the former head; furthermore, we put new head to `tail` because in 1 element linked list, head and tail will be reference of the same node.
```js
if (this.head) {
  this.head.prev = _node;
} else {
  this.tail = _node;
}
```

Examples of `addToHead`.
```js
var linkedList = new LinkedList();

linkedList.addToHead("1st");
linkedList.addToHead("2nd");
linkedList.addToHead("3rd");

// "3rd -> 2nd -> 1st"
```

`addToTail` function is just switching between head and tail.
```js
LinkedList.prototype.addToTail = function addToTail(value) {
  var _node = new Node(value, null, this.tail);
  if (this.tail) {
    this.tail.next = _node;
  } else {
    this.head = _node;
  }
  this.tail = _node;
}
```

Examples of `addToTail`.
```js
var linkedList = new LinkedList();

linkedList.addToTail("1st");
linkedList.addToTail("2nd");
linkedList.addToTail("3rd");

// 1st -> 2nd -> 3rd
```

To delete a node, a simple and efficient way is removing it from head or tail. Let's see `removeHead`.
```js
LinkedList.prototype.removeHead = function removeHead() {
  if (!this.head) {
    return null;
  }
  const value = this.head.value;
  if (this.head.next) {
    this.head = this.head.next;
    this.head.prev = null;
  } else {
    this.tail = null;
  }
  return value;
}
```

The tricky part is moving `head` to next node in the list.
- If next node is not empty, make it the new `head` then we remove old head by assign `null` to `prev` of new head. This means there is no node come after current head.  
```js{2-3}
if (this.head.next) {  
      this.head = this.head.next;  
      this.head.prev = null;  
} else {
```
- If next node is empty, that's means the entire linked list has only 1 node; therefore, if we want to remove head we should remove tail also.
```js{3}
...
} else {
      this.tail = null;
}
```

`removeTail` is similar.
```js
LinkedList.prototype.removeTail = function removeTail() {
  if (!this.tail) {
    return null;
  }
  const value = this.tail.value;
  if (this.tail.prev) {
    this.tail = this.tail.prev;
    this.tail.next = null;
  } else {
    this.head = null;
  }
  return value;
}
```

Examples of `removeHead` and `removeTail`.
```js
const linkedList = new LinkedList();

linkedList.addToHead("1st");
linkedList.addToHead("2nd");
linkedList.addToHead("3rd");
linkedList.addToHead("4th");
linkedList.addToHead("5th");

linkedList.removeHead(); // "5th"
linkedList.removeTail(); // "1st"
linkedList.removeHead(); // "4th"
linkedList.removeTail(); // "2nd"

console.log(linkedList.value); // "3rd"
```

And this is a rough principle of *linked list*. You can do more with it by adding functions like `search(index)`, `search(value)`, `indexOf(value)` or whatever you can think of. As you can see, *linked list* is very simple data structure and I'm not sure why I thought it is super hard to understand when I was in university years. 😕

## References
1. **Vpn_talent**'s [answer](https://stackoverflow.com/a/45433210) in [When to use a linked list over an array/array list?](https://stackoverflow.com/questions/393556/when-to-use-a-linked-list-over-an-array-array-list/45433210#45433210).
2. **"Memory Management"** in [What’s a Linked List, Anyway? [Part 1]](https://medium.com/basecs/whats-a-linked-list-anyway-part-1-d8b7e6508b9d).
