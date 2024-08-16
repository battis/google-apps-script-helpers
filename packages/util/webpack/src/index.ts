import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import GasPlugin from 'gas-webpack-plugin';
import path from 'path';
import webpack from 'webpack';

type Options = {
  rootPath: string;
  mode?: webpack.Configuration['mode'];
  target: webpack.Configuration['target'];
  entryPath?: string;
  bundleName?: string;
  outputFilename?: string;
  outputPath?: string;
  rules?: webpack.RuleSetRule[];
  plugins?: webpack.WebpackPluginInstance[];
};

export default function config({
  rootPath,
  mode = 'production',
  entryPath = 'src/index.ts',
  bundleName = 'Code',
  outputFilename = '[name].gs',
  outputPath = 'dist',
  rules = [],
  plugins = []
}: Options) {
  return {
    mode,
    entry: {
      [bundleName]: path.resolve(rootPath, entryPath)
    },
    output: {
      path: path.resolve(rootPath, outputPath),
      filename: outputFilename
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'ts-loader'
        },
        ...rules
      ]
    },
    plugins: [new CleanWebpackPlugin(), new GasPlugin(), ...plugins],
    optimization: {
      innerGraph: true,
      usedExports: true
    }
  };
}
