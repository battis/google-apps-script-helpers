import cli from '@battis/qui-cli';
import appRootPath from 'app-root-path';
import fs from 'fs';
import path from 'path';

const root = appRootPath.toString();
const args = cli.init({ args: { requirePositionals: 2 } });
for (let i = 0; i < args.positionals.length; i += 2) {
  const target = args.positionals[i];
  let tag = args.positionals[i + 1];
  if (!tag) {
    tag = 'div';
  }
  const content = fs.readFileSync(path.resolve(root, target));
  fs.writeFileSync(
    path.resolve(root, target.replace(/\.js$/, '.html')),
    `<${tag}>${content}</${tag}>`
  );
  cli.shell.rm(path.resolve(root, target));
}
