---
title: "Reading other people's code episode 2: Array.prototype.map"
date: 2019-01-17
---

`Array.prototype.map` is my one of the most frequently used JavaScript function.

[Source code](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)

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

Because this is polyfill source code so first few lines are about assigning `map` function to `Array.prototype`. The function receives `callback` as first argument. Second argument is `thisArg` but was commented out because later in the code it will be retrieved by using `arguments[1]`.

```js
if (!Array.prototype.map) {

  Array.prototype.map = function(callback/*, thisArg*/) {
  ...
```

After are declaring empty variables and validation of `this` (another usage of `== null` for `null` and `undefined` checking), statement `var O = Object(this);` make me curious why they have to do this.

```js
var T, A, k;

if (this == null) {
  throw new TypeError('this is null or not defined');
}

// 1. Let O be the result of calling ToObject passing the |this|
//    value as the argument.
var O = Object(this);
```

[MDN's `Object` description](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object).

>The Object constructor creates an object wrapper for the given value. If the value is `null` or `undefined`, it will create and return an empty object, otherwise, it will return an object of a Type that corresponds to the given value. If the value is an object already, it will return the value.

>When called in a non-constructor context, `Object` behaves identically to `new Object()`.

I tried to use `Object()` with multiple types, all returned values were converted to `Object`. So my assumption of using this function is to make sure `this` is an object.

```js
Object(null)        // {}
Object(undefined)   // {}
Object()            // {}
Object([1, 2, 3])   // [1, 2, 3]
Object({a: 1})      // {a: 1}

Object("1")         // String {"1"} type "object"
Object(1)           // Number {1} type "object"
Object(false)       // Boolean {false} type "object"
```

I never saw any usages of `>>>` in JavaScript before so I googled and learned that it is called [__Zero-fill right shift__](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators#%3E%3E%3E_(Zero-fill_right_shift)). From the useful comment of the statement, reason for using `>>>` is to convert `Number` to `UNSIGNED INT 32` (This is a [hack way](https://stackoverflow.com/questions/22335853/hack-to-convert-javascript-number-to-uint32). May be because JavaScript has no built-in function to do it). I still don't know why `len` have to be `Uint32` though.

```js
// 2. Let lenValue be the result of calling the Get internal
//    method of O with the argument "length".
// 3. Let len be ToUint32(lenValue).
var len = O.length >>> 0;
```

Then check if `callback` is type `function`.

```js
// 4. If IsCallable(callback) is false, throw a TypeError exception.
// See: http://es5.github.com/#x9.11
if (typeof callback !== 'function') {
  throw new TypeError(callback + ' is not a function');
}
```

Then assign `T` with second argument of `map` function (remember `thisArg`?) and will be used later in iteration of target array.

```js
// 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
if (arguments.length > 1) {
  T = arguments[1];
}

...

// ii. Let mappedValue be the result of calling the Call internal
//     method of callback with T as the this value and argument
//     list containing kValue, k, and O.
mappedValue = callback.call(T, kValue, k, O);
```

Then assign `A` with an empty array of size determined by `len` (length of target array).

```js
// 6. Let A be a new array created as if by the expression new Array(len)
//    where Array is the standard built-in constructor with that name and
//    len is the value of len.
A = new Array(len);
```

Then we finally come to iteration which is pretty simple, each index of `A` will be assigned by the result from executions of `callback`. When iteration completed, return `A` as a final result.

```js
k = 0;

while (k < len) {

  var kValue, mappedValue;

  if (k in O) {

    kValue = O[k];

    mappedValue = callback.call(T, kValue, k, O);

    A[k] = mappedValue;
  }

  k++;
}

return A;
```

To be honest, I never used [`in`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/in) operator before, I have seen usages of it but never tried in my code. In this case, `if (k in O)` will return false when `k` is not an index of `O`. (example below comes from [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/in#Description))

```js
var trees = ['redwood', 'bay', 'cedar', 'oak', 'maple'];
0 in trees        // returns true
3 in trees        // returns true
6 in trees        // returns false
```

And that's it `Array.prototype.map` simple but yet I learned a lot even from very tiny source code.

---
### Things I learned
- All those number bullet-point comments come from [Annotated ECMAScript 5.1](http://es5.github.io/#x15.4.4.19)
- From `>>>`
  - It called __Zero-fill right shift__.
  - Convert `Number` base 10 to binary using [`Number.toString(2)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toString).
  - Some of [bitwise operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators).
  - `UNSIGNED INT` has no negative value.
- Using `in` with `Array` and index number.
- English writing
  - [`come from` vs `came from`](https://english.stackexchange.com/questions/103152/i-came-from-italy-or-i-come-from-italy)--use `come` *mostly*.
  - [`if` vs `whether`](https://dictionary.cambridge.org/grammar/british-grammar/if-or-whether)--*almost* the same meanings and usages.

### References
- [When should I use UNSIGNED and SIGNED INT in MySQL?](https://stackoverflow.com/questions/11515594/when-should-i-use-unsigned-and-signed-int-in-mysql)
- [Hack to convert javascript number to UInt32](https://stackoverflow.com/questions/22335853/hack-to-convert-javascript-number-to-uint32)
