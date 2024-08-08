import cli from '@battis/qui-cli';
import appRootPath from 'app-root-path';
import fs from 'fs';
import { minify } from 'html-minifier-terser';
import { createRequire } from 'module';
import path from 'path';

const require = createRequire(import.meta.url);
const root = process.cwd(); //appRootPath.toString();
const htmlMinifierTerserOptions = require('@battis/gas-lighter.options/html-minifier-terser');

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
