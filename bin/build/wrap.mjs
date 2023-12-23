#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from '../../package.json' assert { type: 'json' };

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templatePath = path.join(__dirname, '../../js');
const root = path.join(__dirname, '../../');

function isError(err) {
  if (err) {
    console.error(err);
    return true;
  }
  return false;
}

function globalize(path) {
  const parents = path.replace(templatePath, '').split('/').slice(1);
  let result = '';
  for (let i = 0; i < parents.length; i++) {
    parents[i] = parents[i].replace(/(\/index)?.js$/, '');
    const inheritance = `g.${parents.slice(0, i + 1).join('.')}`;
    if (i + 1 === parents.length) {
      result += `${inheritance}=lib;`;
    } else {
      result += `${inheritance}=${inheritance}||{};`;
    }
  }
  return result;
}

async function wrapScripts(file) {
  fs.stat(file, (err, stat) => {
    if (isError(err)) return;
    if (stat.isFile() && !/.*\.d\.ts$/.test(file)) {
      fs.readFile(file, (err, buffer) => {
        if (isError(err)) return;
        fs.writeFile(
          file,
          `((g)=>{${buffer.toString()}${globalize(
            file
          )}})(window.g=window.g||{});`,
          (err) => {
            if (isError(err)) return;
            console.log(`  ${file}`.replace(templatePath, ''));
          }
        );
      });
    } else if (stat.isDirectory()) {
      fs.readdir(file, (err, files) => {
        if (isError(err)) return;
        files.map((f) => wrapScripts(path.join(file, f)));
      });
    }
  });
}

console.log(
  `wrapping scripts in ${templatePath.replace(root, `${pkg.name}/`)}`
);
wrapScripts(templatePath);
