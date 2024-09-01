import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
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
  appscriptPath?: string;
  rules?: webpack.RuleSetRule[];
  plugins?: webpack.WebpackPluginInstance[];
};

export default function config({
  rootPath,
  mode = 'production',
  entryPath = 'src/index.ts',
  bundleName = 'Code',
  outputFilename = '[name].js',
  outputPath = 'dist',
  appscriptPath = './appsscript.json',
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
    plugins: [
      new CleanWebpackPlugin(),
      // @ts-ignore
      new GasPlugin(),
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(rootPath, appscriptPath),
            to: path.resolve(rootPath, outputPath, 'appsscript.json')
          }
        ]
      }),
      ...plugins
    ],
    optimization: {
      innerGraph: true,
      usedExports: true
    }
  };
}
