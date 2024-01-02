const path = require('path');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlMinimizerPlugin = require('html-minimizer-webpack-plugin');
const minimizerOptions = require('./bin/minimizer-options');

module.exports = {
  entry: {
    client: path.resolve(__dirname, 'src/client/index.ts')
  },
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: 'g',
    clean: true
  },
  resolve: {
    extensions: ['.ts']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          configFile: 'tsconfig.client.json'
        }
      },
      {
        test: /\.html$/i,
        type: 'asset/source'
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
    ],
    splitChunks: false
  }
};
