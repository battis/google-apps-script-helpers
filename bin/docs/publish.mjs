#!/usr/bin/env node
import appRootPath from 'app-root-path';
import fs from 'fs';
import path from 'path';
import cli from '@battis/qui-cli';

const pkg = JSON.parse(
  fs.readFileSync(new URL('../../package.json', import.meta.url))
);
const tag = `v${pkg.version}-docs`;

cli.shell.cd(path.join(appRootPath.toString(), './docs'));
cli.shell.exec('git add -A .');
cli.shell.exec(`git commit -m "Update documentation for v${pkg.version}"`);
cli.shell.exec(`git tag ${tag}`);
cli.shell.exec(`git push origin ${tag}`);
