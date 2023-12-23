const path = require('path');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: {
    'HtmlService/Template': path.resolve(
      __dirname,
      'src/HtmlService/Template/index.ts'
    ),
    'HtmlService/Component/Picker': path.resolve(
      __dirname,
      'src/HtmlService/Component/Picker/index.ts'
    ),
    'HtmlService/Component/Progress': path.resolve(
      __dirname,
      'src/HtmlService/Component/Progress/index.ts'
    )
  },
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'js'),
    filename: '[name].js',
    library: 'lib',
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
          configFile: 'tsconfig.webpack.json'
        }
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
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: { properties: false }
        }
      }),
      new CssMinimizerWebpackPlugin()
    ],
    splitChunks: false
  }
};
