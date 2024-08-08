const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlMinimizerPlugin = require('html-minimizer-webpack-plugin');
const minimizerOptions = require('@battis//gas-lighter.options/html-minifier-terser');

module.exports = {
  entry: {
    client: path.resolve(__dirname, 'src/index.ts')
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
        loader: 'ts-loader'
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
  plugins: [new CleanWebpackPlugin()],
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
