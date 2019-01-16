---
title: "Reading other people's code episode 2: Array.prototype.map"
---

`Array.prototype.map` is my one of the most frequently used JavaScript function. [Its source code](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) looks so simple and short but I still saw something interesting in it.



```js
// Production steps of ECMA-262, Edition 5, 15.4.4.19
// Reference: http://es5.github.io/#x15.4.4.19
if (!Array.prototype.map) {

  Array.prototype.map = function(callback/*, thisArg*/) {

    var T, A, k;

    if (this == null) {
      throw new TypeError('this is null or not defined');
    }

    // 1. Let O be the result of calling ToObject passing the |this|
    //    value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get internal
    //    method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If IsCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }

    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (arguments.length > 1) {
      T = arguments[1];
    }

    // 6. Let A be a new array created as if by the expression new Array(len)
    //    where Array is the standard built-in constructor with that name and
    //    len is the value of len.
    A = new Array(len);

    // 7. Let k be 0
    k = 0;

    // 8. Repeat, while k < len
    while (k < len) {

      var kValue, mappedValue;

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal
      //    method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal
        //    method of O with argument Pk.
        kValue = O[k];

        // ii. Let mappedValue be the result of calling the Call internal
        //     method of callback with T as the this value and argument
        //     list containing kValue, k, and O.
        mappedValue = callback.call(T, kValue, k, O);

        // iii. Call the DefineOwnProperty internal method of A with arguments
        // Pk, Property Descriptor
        // { Value: mappedValue,
        //   Writable: true,
        //   Enumerable: true,
        //   Configurable: true },
        // and false.

        // In browsers that support Object.defineProperty, use the following:
        // Object.defineProperty(A, k, {
        //   value: mappedValue,
        //   writable: true,
        //   enumerable: true,
        //   configurable: true
        // });

        // For best browser support, use the following:
        A[k] = mappedValue;
      }
      // d. Increase k by 1.
      k++;
    }

    // 9. return A
    return A;
  };
}
```

Because of I got this source code from polyfill so first few lines are about assigning `map` function to `Array.prototype`. The function receives `callback` as first argument

```js
if (!Array.prototype.map) {

  Array.prototype.map = function(callback/*, thisArg*/) {
  ...
```

After are declaring empty variables and validation of `this`, statement `var O = Object(this);` make me curious why they have to do this.

```js
var T, A, k; // Ah, 1 letter variable names

if (this == null) {
  throw new TypeError('this is null or not defined');
}

var O = Object(this); // < Why?
```

[MDN's `Object` description](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object).

>The Object constructor creates an object wrapper for the given value. If the value is `null` or `undefined`, it will create and return an empty object, otherwise, it will return an object of a Type that corresponds to the given value. If the value is an object already, it will return the value.

>When called in a non-constructor context, `Object` behaves identically to `new Object()`.

I tried to use `Object()` with multiple types. Last 3 results are what I don't know benefit of making primitive value to type `"object"`.

```js
Object(null) // {}
Object(undefined) // {}
Object() // {}
Object([1, 2, 3]) // [1, 2, 3]
Object({a: 1}) // {a: 1}

Object("1") // String {"1"} type "object"
Object(1) // Number {1} type "object"
Object(false) // Boolean {false} type "object"
```

```js
var len = O.length >>> 0;
```
