const path = require('path');
const GasPlugin = require('gas-webpack-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

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
          loader: 'ts-loader',
          options: { allowTsInNodeModules: true }
        },
        {
          test: /\.html$/i,
          loader: 'html-loader'
        },
        {
          test: /\.s?[ac]ss$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: { importLoaders: 2 }
            },
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
      new GasPlugin({
        autoGlobalExportsFiles: ['**/*.global.ts']
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
        new CssMinimizerWebpackPlugin()
      ]
    }
  };
  if (!production) {
    config.mode = 'development';
    config.devtool = 'inline-source-map';
  }
  return config;
};
