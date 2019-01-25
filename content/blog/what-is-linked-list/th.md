---
title: linked list คืออะไร?
date: 2019-01-23
tldr: เข้าใจไม่ยาก แต่ก็ไม่รู้จะเอาไปใช้ทำอะไร ในชีวิตจริง
lang: th
langs: ['en', 'th']
---

เมื่อไม่นานมานี้ ผมได้แรงบันดาลใจจากบทความ [I interviewed at five top companies in Silicon Valley in five days, and luckily got five job offers](https://medium.com/@XiaohanZeng/i-interviewed-at-five-top-companies-in-silicon-valley-in-five-days-and-luckily-got-five-job-offers-25178cf74e0f) และ[หลาย ๆ](https://news.ycombinator.com/item?id=18931129) [คอมเมนท์](https://news.ycombinator.com/item?id=11579757) จาก Hacker news ว่าเราก็ควรจะมีความรู้พวก algorithm หรือ data structure ไว้บ้าง เพื่อที่เมื่อถึงเวลา ก็สามารถหยิบจับมาใช้ได้ โดยที่ไม่ได้ทำแบบถึก ๆ เอาเพียงอย่างเดียว เราไม่จำเป็นแม้แต่จะต้องจำด้วยซ้ำว่ามันเขียนอย่างไร แค่รู้ว่าสถานการณ์นี้ ต้องค้นหาด้วยคีเวิร์ดอะไร ก็เพียงพอแล้ว

สมัยเรียนมหาวิทยาลัย linked list ถือเป็นคำต้องห้ามของผม และเพื่อน ๆ บางคน (ต้องอ้างแบบนี้เพราะ ไม่ใช่ผมคนเดียวที่ได้ยินคำนี้ แล้วส่ายหัว) ตอนนั้นรู้สึกว่ามันยาก และไม่เข้าใจมันเลย (สมัยนู้นผมเป็นคนไม่ค่อยได้เรื่อง และไม่ได้ใส่ใจกับอะไรพวกนี้มากนัก ผมคนที่กำลังเขียนบทความนี้ ดีขึ้นมานิดหน่อย)  และเมื่อไม่กี่ปีที่ผ่านมา ผมซื้อ Udemy course ชื่อ [Learning Data Structures in JavaScript from Scratch](https://www.udemy.com/learning-data-structures-in-javascript-from-scratch/) (ไม่ได้ค่าโฆษณา) ซึ่งมีสอนเรื่อง linked list อยู่ในนั้นด้วย จึงได้รู้ว่า มันไม่ได้ยากเลย ตรงกันข้ามคือมันเข้าใจง่ายด้วยซ้ำ ก็เลยจะขอเปิดซีรีย์นี้ด้วย linked list ก็แล้วกัน

## ความหมาย

จาก [Wikipedia](https://en.wikipedia.org/wiki/Linked_list)
> In computer science, a Linked list is a linear collection of data elements, (...) each element points to the next. It is a data structure consisting of a collection of nodes which together represent a sequence. In its most basic form, each node contains: data, and a reference (in other words, a link) to the next node in the sequence.

จาก [GeeksforGeeks](https://www.geeksforgeeks.org/data-structures/linked-list/)
> A linked list is a linear data structure, (...) The elements in a linked list are linked using pointers (...)

ถ้าจะให้เรียบเรียงตามความเข้าใจของผม ก็พอจะสรุปได้ว่า linked list คือ data structure ที่ประกอบไปด้วย ข้อมูล (ในที่นี้จะเรียกว่า node) ที่ต่อกันเป็นเส้นตรง (เส้นตรงหมายถึง มีแค่ 2 ทิศทาง คือ ก่อนหน้า หรือถัดไป) โดยแต่ละ node จะสามารถอ้างถึง node ที่อยู่ถัดไปได้เท่านั้น

## การนำไปใช้

ตลอดชีวิตการเป็นโปรแกรมเมอร์ผมไม่เคยมีโอกาสได้เอา linked list ไปใช้เลยสักครั้ง ก็เลยต้องพึ่งเหตุผลจากคนอื่น ๆ แทน ซึ่งพอจะสรุปคร่าว ๆ ได้ว่า
- linked list เพิ่ม หรือลบ ข้อมูล ได้มีประสิทธิภาพกว่า array list ในบางเคส <sup>[1]</sup>
```js{5,7}
Algorithm           ArrayList   LinkedList
seek front            O(1)         O(1)
seek back             O(1)         O(1)
seek to index         O(1)         O(N)
insert at front       O(N)         O(1)
insert at back        O(1)         O(1)
insert after an item  O(N)         O(1)
````
- linked list มีความยืดหยุ่นมากกว่า ในการจัดการหน่วยความจำ <sup>[2]</sup>  

สรุปคือ ถ้าคุณไม่ได้จะเขียนโค้ดที่ low level มากจริงๆ ก็แทบจะไม่มีโอกาสได้ใช้ linked list เลย

## ตัวอย่าง

[code](https://repl.it/@warizz/NodeJsLinkedList)

ในที่นี้จะเป็นตัวอย่างในการเขียน linked list แบบ doubly ซึ่งจะมี reference 2 ทางคือ หัวและหาง (แบบปกติ singly จะมีแค่หัว)

เริ่มต้นด้วยการสร้าง คลาส `Node` สำหรับเก็บข้อมูล(`value`) และ reference ของ node ข้าง ๆ ด้วย `next` และ `prev`
```js
function Node(value, next, prev) {
  this.value = value;
  this.next = next;
  this.prev = prev;
}
```

และคลาส `LinkedList` ที่เก็บแค่ reference ของ `Node` หัวและหางเท่านั้น
```js
function LinkedList() {
  this.head = null;
  this.tail = null;
}
```

จากนั้นก็เพิ่มฟังชัน `addToHead` ให้คลาส `LinkedList`

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

เริ่มฟังชันด้วยการ `new Node` แล้วให้หัวเก่าเป็น หัวถัดไปของหัวใหม่
```js
var _node = new Node(value, this.head /* next */, null);
```

ถ้าเดิมหัวมีข้อมูลอยู่แล้ว ให้ตั้งค่า `prev` ของ node นั้นเป็นอันใหม่ แต่ถ้าไม่มี ให้เพิ่ม node ใหม่เข้าไปในหางด้วย

```js
if (this.head) {
  this.head.prev = _node;
} else {
  this.tail = _node;
}
```

เราสามารถทดลองใช้ `addToHead` ได้ดังนี้

```js
var linkedList = new LinkedList();

linkedList.addToHead("1st");
linkedList.addToHead("2nd");
linkedList.addToHead("3rd");

// "3rd -> 2nd -> 1st"
```

`addToTail` นั้นไม่ต่างกันมาก เพียงแค่สลับหัวและหาง
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

ทดลองใช้ `addToTail`

```js
var linkedList = new LinkedList();

linkedList.addToTail("1st");
linkedList.addToTail("2nd");
linkedList.addToTail("3rd");

// 1st -> 2nd -> 3rd
```

การลบ node ออกนั้น วิธีที่ง่ายและมีประสิทธิภาพที่สุดก็คือการเอาออกทางหัว หรือหาง มาดูที่หัวกันก่อน
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

ส่วนที่ดูสับสนนิดหน่อย ก็น่าจะอยู่ตรงที่การย้ายหัวไปไว้ที่ node ถัดไป
- ถ้า node ถัดไปไม่ว่างเปล่า ก็เอามาเป็น `head` แทน แล้วจึงตัดหัวเก่าออกด้วยการใส่ `null` ให้ `.prev` ของหัวใหม่
- ถ้า node ถัดไปว่างเปล่า แสดงว่า ทั้ง linked list นั้นมี node เดียว การเอาหัวออก จึงจำเป็นต้องเอาหางออกด้วย ในที่นี้เลยต้องให้ `tail` เป็น `null`

```js
if (this.head.next) {  
  this.head = this.head.next;  
  this.head.prev = null;  
} else {
  this.tail = null;
}
```

`removeTail` ก็คล้ายกัน
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

ตัวอย่างการใช้งาน `removeHead` และ `removeTail`
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

และแล้วก็จบหลักการคร่าว ๆ ของ linked list ซึ่งไม่ได้ยากเลย ผมก็ไม่เข้าใจเหมือนกันว่าทำไมสมัยโน้นถึงคิดว่ามันยากเหลือเกิน จริง ๆ แล้วคุณยังสามารถทำอะไรกับมันได้อีกมากมาย เช่น `search(index)`, `search(value)` หรือ `indexOf(value)` ซึ่งจะไม่ขอพูดถึงในนี้ และคิดว่าน่าจะเอาไปเขียนกันเองได้ไม่ยาก

## อ้างอิง
1. **Vpn_talent**'s [answer](https://stackoverflow.com/a/45433210) in [When to use a linked list over an array/array list?](https://stackoverflow.com/questions/393556/when-to-use-a-linked-list-over-an-array-array-list/45433210#45433210).
2. **"Memory Management"** in [What’s a Linked List, Anyway? [Part 1]](https://medium.com/basecs/whats-a-linked-list-anyway-part-1-d8b7e6508b9d).
