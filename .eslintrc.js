module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'prettier',
    'prettier/react',
    'prettier/standard',
  ],
  globals: {
    __PATH_PREFIX__: true,
  },
  plugins: ['react', 'prettier'],
  parser: 'babel-eslint',
  rules: {
    'no-console': 1,
    'prettier/prettier': 1,
    'react/prop-types': 1,
  },
};
