const path = require('path');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: {
    'HtmlService/Component': path.resolve(
      __dirname,
      'src/HtmlService/Component/index.lib.ts'
    ),
    'HtmlService/Component/Picker': path.resolve(
      __dirname,
      'src/HtmlService/Component/Picker/index.lib.ts'
    ),
    'HtmlService/Component/Progress': path.resolve(
      __dirname,
      'src/HtmlService/Component/Progress/index.lib.ts'
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
