# @battis/webpack-typescript-gas

## Install

In `.npmrc`:

```
auto-install-peers=true
public-hoist-pattern[]=@google/clasp
public-hoist-pattern[]=@tsconfig/recommended
public-hoist-pattern[]=@types/*
public-hoist-pattern[]=typescript
public-hoist-pattern[]=*webpack*
public-hoist-pattern[]=*loader*
```

```bash
pnpm i -D @battis/webpack-typescript-gas@github:battis/webpack-typescript-gas
```

In `webpack.config.js`:

```js
const config = require('@battis/webpack-typescript-gas');

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
