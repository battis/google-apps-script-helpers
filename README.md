# @battis/gas-lighter

[![npm version](https://badge.fury.io/js/@battis%2Fgas-lighter.svg)](https://badge.fury.io/js/@battis%2Fgas-lighter)

## Caution

This is an idiosyncratic collection of add-ons and helpers for writing TypeScript code to be compiled into Google Apps Script. It is under constant evolution and tweaking. My basic approach has been that, whenever I start to see the same slog of boiler plate repetitivity in my GAS scripts, I try to exile it to this library to a) allow myself to write shorter code and b) ensure that my boilerplate is, in fact, consistent.

Use at your own peril. And make pull requests with your own improvements.

-- Seth

## Install

In `.npmrc`:

```
auto-install-peers=true
public-hoist-pattern[]=*prettier*
public-hoist-pattern[]=*eslint*
public-hoist-pattern[]=@tsconfig/recommended
public-hoist-pattern[]=@google/clasp
public-hoist-pattern[]=@tsconfig/recommended
public-hoist-pattern[]=@types/*
public-hoist-pattern[]=typescript
public-hoist-pattern[]=*webpack*
public-hoist-pattern[]=*loader*
```

Then:

```bash
pnpm init
pnpm i @battis/gas-lighter
pnpm i -D shx npm-run-all
```

If working on an existing Google Apps Script project:

```bash
npx clasp clone [script ID]
```

If creating a new project:

```bash
npx clasp create [Script Title]
```

In `.gitignore`:

```
/.clasp.json
/build/
```

In `.eslintrc.json`:

```json
{
  "extends": "@battis/gas-lighter/.eslintrc.json"
}
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

In `package.json`:

```json
{
  "scripts": {
    "build": "run-s build:*",
    "build:clean": "shx rm -rf build",
    "build:compile": "webpack",
    "deploy": "run-s deploy:*",
    "deploy:build": "npm run build",
    "deploy:push": "clasp push"
  }
}
```
