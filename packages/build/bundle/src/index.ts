import bundle from '@battis/webpack';
import CopyPlugin from 'copy-webpack-plugin';
import GasPlugin from 'gas-webpack-plugin';
import path from 'path';

type GasLighterOptions = Parameters<typeof bundle.fromTS.toVanillaJS>[0] & {
  appscriptPath?: string;
};

export default function config({
  root,
  output,
  appscriptPath = './appscript.json',
  plugins = [],
  ...rest
}: GasLighterOptions) {
  output = {
    path: 'build',
    filename: '[name]',
    ...output
  };

  // @ts-ignore
  plugins.push(new GasPlugin());

  plugins.push(
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(root, appscriptPath),
          to: path.resolve(root, output!.path!, 'appsscript.json')
        }
      ]
    })
  );

  return bundle.fromTS.toVanillaJS({ root, output, plugins, ...rest });
}
