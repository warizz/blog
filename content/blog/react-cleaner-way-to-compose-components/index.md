---
title: Cleaner way to compose components
date: 2019-01-03
tldr: "Use \"reduceRight\""
---

I often found components were exported like this which look very confusing.

```js
...

export default graphql(...)(withRouter(translate('common')(Component)))

```

My colleague made something like this which is a lot better than above.

```js
const HOCs = [
  graphql(...),
  withRouter,
  translate('common'),
];

const ComponentWithHoc = HOCs.reduce((a, b) => b(a), MainComponent);

```

From the idea, I made a function for reusable purpose.

```js
function compose(baseComponent, ...args) {
  return args.reduce((a, b) => b(a), baseComponent);
}

// Usage
export default compose(
  BaseComponent, // base
  graphql(...), // 3rd
  withRouter, // 2nd
  translate('common'), // 1st
)

```

This approach looks cleaner but a little bit weird because of the flow of composing that start from the first argument then goes to last then the one before last and so on.

One day while surfing the interweb, I stumbled upon a topic and found out that we can use Array's [`reduceRight`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight) function (I didn't even know it exists!) to make the flow more natural.

So the final result would be.
```js
function compose(...args) {
  return args.reduceRight((acc, current) => current(acc));
}

// Usage
export default compose(
  graphql(...), // 3rd
  withRouter, // 2nd
  translate('common'), // 1st
  BaseComponent, // base
)

```
