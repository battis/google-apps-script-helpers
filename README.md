# @battis/webpack-typescript-gas

## Use

In `.npmrc`:

```
auto-install-peers = true
```

Then run:

```bash
npm i -D @battis/webpack-typescript-gas@github:battis/webpack-typescript-gas
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
  ...
  "scripts": {
    "clean": "rm -rf build",
    "build": "npx webpack",
    "deploy": "npx clasp push"
  }
  ...
}
```

## Development

I use `pnpm` over `npm` preferentially (there are only so many hours of progress bars and only so much disk space that I can allocate to this stuff). But… `webpack` does not resolve packages in a standard way, and implicily relies on `npm`'s `node_modules` layout. So…

```bash
pnpm i --shamefully-hoist
```

sets up `node_modules` to work with `webpack` and

```bash
npm i --package-lock-only
```

updates `package-lock.json` for distribution.

Blergh.
