import cli from '@battis/qui-cli';
import appRootPath from 'app-root-path';
import fs from 'fs';
import { glob } from 'glob';
import path from 'path';

function htmlify(filePath, tag, destroy) {
  const content = fs.readFileSync(filePath);
  const htmlPath = filePath.replace(/\.js$/, '.html');
  fs.writeFileSync(htmlPath, `<${tag}>${content}</${tag}>`);
  if (destroy) {
    cli.shell.rm(filePath);
  }
  cli.log.info(
    `Htmlified ${cli.colors.url(filePath)} → ${cli.colors.url(
      path.basename(htmlPath)
    )}`
  );
}

function tag(filePath) {
  switch (path.extname(filePath)) {
    case '.js':
      return 'script';
    case '.css':
      return 'style';
    default:
      return 'div';
  }
}

const args = cli.init({
  args: {
    requirePositionals: true,
    flags: {
      destroy: {
        description:
          'Delete original file by default (--no-destroy to prevent)',
        default: true
      }
    }
  }
});
glob
  .sync(args.positionals, { cwd: appRootPath.toString(), absolute: true })
  .map((filePath) => htmlify(filePath, tag(filePath), args.values.destroy));
