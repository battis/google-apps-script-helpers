#!/usr/bin/env node
import appRootPath from 'app-root-path';
import path from 'path';
import cli from '@battis/qui-cli';

cli.shell.cd(path.join(appRootPath.toString(), './docs/*'));
