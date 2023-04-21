# @battis/gas-lighter

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

```bash
pnpm i -D @battis/gas-lighter@github:battis/gas-lighter#dist
```

In `webpack.config.js`:

```js
const config = require('@battis/gas-lighter/webpack.config');

module.exports = config({ root: __dirname });
```

## Configuration

Configuration options include, with defaults:

```json
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
    "clean": "rm -rf build",
    "build": "npx webpack",
    "deploy": "npx clasp push"
  }
}
```
