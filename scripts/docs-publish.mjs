#!/usr/bin/env node
import appRootPath from 'app-root-path';
import path from 'path';
import shell from 'shelljs';

shell.cd(path.join(appRootPath, 'docs'));
shell.exec('git add -A .');
shell.exec('git commit -m "Update documentation"');
shell.exec('git push');
