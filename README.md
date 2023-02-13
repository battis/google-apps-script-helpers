# @battis/eslint-config

In `.npmrc`:

```
auto-install-peers = true
```

```bash
npm add -D @battis/webpack-typescript-gas@github:battis/webpack-typescript-gas
npx clasp clone <project id>
```

In `webpack.config.js`:

```js
const path = require('path');
const config = require('@battis/webpack-typescript-gas');

config.output.path = path.join(__dirname, 'build');

module.exports = config;
```

In `package.json`:

```json
{
  ...
  "scripts": {
    "clean": "rm -rf build",
    "build": "npx webpack"
    "deploy": "npx clasp push"
  }
  ...
}
```
