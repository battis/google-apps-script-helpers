# @battis/gas-lighter

[![npm version](https://badge.fury.io/js/@battis%2Fgas-lighter.svg)](https://badge.fury.io/js/@battis%2Fgas-lighter)
[![Module type: CJS](https://img.shields.io/badge/module%20type-cjs-brightgreen)](https://nodejs.org/api/modules.html#modules-commonjs-modules)

## Caution

This is an idiosyncratic collection of add-ons and helpers for writing TypeScript code to be compiled into Google Apps Script. It is under constant evolution and tweaking. My basic approach has been that, whenever I start to see the same slog of boiler plate repetitivity in my GAS scripts, I try to exile it to this library to a) allow myself to write shorter code and b) ensure that my boilerplate is, in fact, consistent.

Use at your own peril. And make pull requests with your own improvements.

-- Seth

## Install

```bash
npm i @battis/gas-lighter
npm i -D npm-run-all
```

If installing with `pnpm` a postinstall script will "shamefully" hoist dependencies

If working on an existing Google Apps Script project:

```bash
npx clasp clone [script ID]
```

If creating a new project:

```bash
npx clasp create [Script Title]
```

In `.claspignore`:

```
**/**
!appsscript.json
!build/*.js
!css/*.html
!js/*.html
!templates/*.html
.git/**
node_modules/**
```

In `.gitignore`:

```
/.clasp.json
/build/
```

In `tsconfig.json`:

```json
{
  "extends": "@battis/gas-lighter/tsconfig.json",
  "compilerOptions": {
    "outDir": "build"
  },
  "include": ["src"]
}
```

In `webpack.config.js`:

```js
module.exports = require('@battis/gas-lighter/webpack.config')({
  root: __dirname
});
```

In `package.json`:

```json
{
  "scripts": {
    "build": "webpack",
    "deploy": "run-s deploy:*",
    "deploy:build": "npm run build",
    "deploy:push": "clasp push"
  },
  "eslintConfig": {
    "extends": "@battis/gas-lighter/.eslintrc.json"
  }
}
```

## Configuration

Configuration options include, with defaults:

```js
{
  root, // absolute path
  build: "build", // path relative to root
  bundle: "main", // string name
  entry: "./src/index.ts" // path relative to webpack.config.js
}
```
