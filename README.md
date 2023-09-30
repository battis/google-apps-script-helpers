# @battis/gas-lighter

[![npm version](https://badge.fury.io/js/@battis%2Fgas-lighter.svg)](https://badge.fury.io/js/@battis%2Fgas-lighter)
[![Module type: CJS](https://img.shields.io/badge/module%20type-cjs-brightgreen)](https://nodejs.org/api/modules.html#modules-commonjs-modules)

### or "my kingdom for a progress bar!"

## Caution

This is an idiosyncratic collection of add-ons and helpers for writing TypeScript code to be compiled into Google Apps Script. It is under constant evolution and tweaking. My basic approach has been that, whenever I start to see the same slog of boiler plate repetitivity in my GAS scripts, I try to exile it to this library to a) allow myself to write shorter code and b) ensure that my boilerplate is, in fact, consistent.

Use at your own peril. And make pull requests with your own improvements.

-- Seth

## Install

```bash
npm i @battis/gas-lighter
npx clasp login # if not already logged in
npx @battis/gas-lighter setup
```

## Webpack Configuration

Configuration options include, with defaults:

```js
{
  root, // absolute path
  build: "build", // path relative to root
  bundle: "main", // string name
  entry: "./src/index.ts" // path relative to webpack.config.js
}
```
