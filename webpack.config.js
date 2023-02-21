const path = require('path');
const GasPlugin = require('gas-webpack-plugin');

module.exports = ({
  root,
  build = 'build',
  bundle = 'main',
  entry = './src/index.ts',
}) => {
  return {
    mode: 'production',
    entry: {
      [bundle]: entry,
    },
    output: {
      path: path.join(root, build),
      filename: '[name]-bundle.js',
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          options: { allowTsInNodeModules: true },
        },
        {
          test: /\.html$/,
          type: 'asset/source',
        },
      ],
    },
    plugins: [new GasPlugin()],
  };
};
