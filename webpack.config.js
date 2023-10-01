const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const GasPlugin = require('gas-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'src/index.ts'),
  mode: 'development', //'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: 'g'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          configFile: 'tsconfig.webpack.json'
        }
      },
      {
        test: /\.html$/,
        type: 'asset/source'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new GasPlugin({ autoGlobalExportsFiles: ['**/*.global.ts'] })
  ]
};
