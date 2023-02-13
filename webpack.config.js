const GasPlugin = require('gas-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    main: './src/index.ts',
  },
  output: {
    path: './build',
    filename: '[name]-bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: require.resolve('ts-loader'),
        options: { allowTsInNodeModules: true },
      },
    ],
  },
  plugins: [new GasPlugin()],
};
