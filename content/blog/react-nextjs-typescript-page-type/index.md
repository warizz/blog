---
title: React NextJs and Typescript - What is correct type for a page
date: 2020-04-19
tldr: `NextPage<PropsFromGetInitialProps>`
---

This code comes from [NextJs' documentation](https://nextjs.org/learn/excel/typescript/page-types) and still valid for latest stable [`nextjs` package](https://www.npmjs.com/package/next)

```tsx
import { NextPage } from 'next';

const Home: NextPage<{ userAgent: string }> = ({ userAgent }) => (
  <h1>Hello world! - user agent: {userAgent}</h1>
);

Home.getInitialProps = async ({ req }) => {
  const userAgent = req ? req.headers['user-agent'] || '' : navigator.userAgent;
  return { userAgent };
};

export default Home;
```
