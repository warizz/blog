---
title: 'Working with legacy code: environment variables'
date: 2018-12-12
tldr: "I'm measuring my work by meaningfulness and efficiency"
---

Hard-coded environment variables make deployment to another environment very hard because we have to look into the code to find out where are all the conditions. It is also not secure because we have to put some API key into the code.

In `webpack` we used to define environment variables like this
```js
let globalVars = new webpack.DefinePlugin({
  GRAPH_SERVER: JSON.stringify('some-url'),
  API_SERVER: JSON.stringify('some-url'),
  ...
});
if (process.env.NODE_ENV === 'production') {
  globalVars = new webpack.DefinePlugin({
    GRAPH_SERVER: JSON.stringify('some-url'),
    API_SERVER: JSON.stringify('some-url'),
    ...  
  });
} else if (process.env.NODE_ENV === 'local') {
  globalVars = new webpack.DefinePlugin({
    GRAPH_SERVER: JSON.stringify('some-url'),
    API_SERVER: JSON.stringify('some-url'),
    ...
  });
}
```

If we need to have another environment like `test` or `staging` we have add more if conditions.
```js
...
} else if (process.env.NODE_ENV === 'local') {
  globalVars = new webpack.DefinePlugin({
    GRAPH_SERVER: JSON.stringify('some-url'),
    API_SERVER: JSON.stringify('some-url'),
    ...
  });
} else if (process.env.NODE_ENV === 'test') {
  ...
} else if (process.env.NODE_ENV === 'staging') {
  ...
}
```

Not only in `webpack` config, we have them all over the places.
```js
// server.js
const hostname = SERVER_TYPE === 'production' ? 'www.theasia.com' : 'www.theasiadev.com';
if (SERVER_TYPE === 'production' || SERVER_TYPE === 'development') {    
  app.use(forceDomain({ hostname, protocol: 'https' }));
}
```

## Solution
Use `process.env` , so we can remove all if conditions then the code looks a lot simpler.
```js
// webpack.config.js
let globalVars = new webpack.DefinePlugin({
  GRAPH_SERVER: JSON.stringify(process.env.GRAPH_SERVER),
  API_SERVER: JSON.stringify(process.env.API_SERVER),
  ...
});
// server.js
const hostname = process.env.HOSTNAME;
if (hostname) {    
  app.use(forceDomain({ hostname, protocol: 'https' }));
}
```

There are so many ways to define `process.env`, on local machine, we use [dotenv](https://www.npmjs.com/package/dotenv) to load all variables from `.env` file. On `Jenkins`, we use [EnvInject Plugin](https://wiki.jenkins.io/display/JENKINS/EnvInject+Plugin). On AWS, it will base on which kind of server you have.

From now on, when we need to have another server, we can just deploy the app to new environment then change `process.env`, no need any new git commit.
