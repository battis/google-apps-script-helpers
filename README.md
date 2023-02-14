# @battis/eslint-config

In `.npmrc`:

```
auto-install-peers = true
```

```bash
npm add -D @battis/webpack-typescript-gas@github:battis/webpack-typescript-gas
```

In `webpack.config.js`:

```js
const config = require('@battis/webpack-typescript-gas');

module.exports = config({ root: __dirname });
```

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
  ...
  "scripts": {
    "clean": "rm -rf build",
    "build": "npx webpack",
    "deploy": "npx clasp push"
  }
  ...
}
```
