const path = require('path');
const GasPlugin = require('gas-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlMinimizerPlugin = require('html-minimizer-webpack-plugin');
const minimizerOptions = require('@battis/gas-lighter.options/html-minifier-terser');

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
      filename: '[name]-bundle.js',
      clean: true
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
        },
        {
          test: /\.scss$/,
          type: 'asset/source',
          use: [
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: ['postcss-preset-env']
                }
              }
            },
            {
              loader: 'sass-loader',
              options: { implementation: require('sass') }
            }
          ]
        }
      ]
    },
    plugins: [
      new Dotenv(),
      new GasPlugin({
        autoGlobalExportsFiles: ['**/*.global.ts', '**/*.global.js']
      }),
      ...plugins
    ],
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            mangle: { properties: false }
          }
        }),
        new CssMinimizerWebpackPlugin(),
        new HtmlMinimizerPlugin({ minimizerOptions })
      ]
    }
  };
  if (!production) {
    config.mode = 'development';
    config.devtool = 'inline-source-map';
  }
  return config;
};
