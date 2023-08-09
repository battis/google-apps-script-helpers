const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const GasPlugin = require('gas-webpack-plugin');

module.exports = ({
  root,
  build = 'build',
  bundle = 'main',
  entry = './src/index.ts',
  production = true,
  plugins = []
}) => {
  const config = {
    mode: 'production',
    entry: {
      [bundle]: entry
    },
    output: {
      path: path.join(root, build),
      filename: '[name]-bundle.js'
    },
    resolve: {
      extensions: ['.ts', '.js']
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'ts-loader'
        },
        {
          test: /\.html$/,
          type: 'asset/source'
        }
      ]
    },
    plugins: [new CleanWebpackPlugin(), new GasPlugin(), ...plugins]
  };
  if (!production) {
    config.mode = 'development';
    config.devtool = 'inline-source-map';
  }
  return config;
};
