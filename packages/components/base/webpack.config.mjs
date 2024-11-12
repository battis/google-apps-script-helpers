import bundle from '@battis/webpack';

const config = bundle.fromTS.toVanillaJS({
  root: import.meta.dirname,
  entry: './component/index.ts',
  bundle: 'index',
  output: {
    path: './public',
    filename: '[name]'
  }
});

config.module.rules.forEach((rule) => {
  if (rule.use && rule.use.loader == 'ts-loader') {
    rule.use.options.configFile = 'tsconfig.component.json';
  }
});

config.module.rules.push({
  test: /\.html?$/i,
  type: 'asset/resource'
});

export default config;
