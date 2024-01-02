import appRootPath from 'app-root-path';
import fs from 'fs';
import path from 'path';
import cli from '@battis/qui-cli';
import { minify } from 'html-minifier-terser';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const root = appRootPath.toString();
const htmlMinifierTerserOptions = require(path.join(
  root,
  'html-minifier-terser-options.js'
));

async function minifyDir(dir) {
  for (const file of fs.readdirSync(dir)) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      await minifyDir(filePath);
    } else if (path.extname(filePath) === '.html') {
      fs.writeFileSync(
        filePath,
        await minify(
          fs.readFileSync(filePath).toString(),
          htmlMinifierTerserOptions
        )
      );
      cli.log.info(`Minified ${cli.colors.url(filePath.replace(root, ''))}`);
    }
  }
}

const args = cli.init({ args: { requirePositionals: 1 } });
for (const arg of args.positionals) {
  minifyDir(path.resolve(root, arg));
}
