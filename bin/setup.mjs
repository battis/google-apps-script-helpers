import fs from 'fs';
import path from 'path';
import cli from '@battis/qui-cli';

import * as url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const templateDir = path.join('../project');
const template = {
  '.claspignore': path.join(templateDir, '.claspignore'),
  '.gitignore': path.join(templateDir, '.gitignore.inc'),
  'package.json': path.join(templateDir, 'package.inc.json'),
  'tsconfig.json': path.join(templateDir, 'tsconfig.json'),
  'webpack.config.js': path.join(templateDir, 'webpack.config.js')
};

function appendByLine(src, dest) {
  const original = fs.readFileSync(dest).toString().split('\n');
  const lines = fs.readFileSync(src).toString().split('\n');
  const appended = [];
  lines.forEach((line) => {
    if (!original.includes(line)) {
      fs.appendFileSync(dest, `${line}\n`);
      appended.push(line);
    }
  });
  cli.log.info(
    `Added ${
      appended.length ? appended.join(', ') : 'nothing'
    } to ${path.basename(dest)}`
  );
}

function appendJSON(src, dest) {
  const recursiveAppend = (json, original) => {
    const appended = original;
    const skipped = {};
    for (const key in json) {
      if (appended[key]) {
        if (typeof appended[key] === 'object') {
          const result = recursiveAppend(json[key], appended[key]);
          appended[key] = result.appended;
          if (Object.keys(result.skipped).length) {
            skipped[key] = result.skipped;
          }
        } else {
          skipped[key] = json[key];
        }
      } else {
        appended[key] = json[key];
      }
    }
    return { appended, skipped };
  };
  const destJSON = JSON.parse(fs.readFileSync(dest).toString());
  const srcJSON = JSON.parse(fs.readFileSync(src).toString());
  const result = recursiveAppend(srcJSON, destJSON);
  fs.writeFileSync(dest, JSON.stringify(result.appended, null, 2));
  cli.log.info(
    `Updated ${path.basename(dest)}${
      Object.keys(result.skipped).length
        ? ` excluding ${JSON.stringify(result.skipped, null, 2)}`
        : ''
    }`
  );
}

function copyFile(src, dest) {
  try {
    fs.copyFileSync(src, dest, fs.constants.COPYFILE_EXCL);
    cli.log.info(`Wrote ${path.basename(dest)}`);
  } catch (e) {
    cli.log.info(
      `${path.basename(dest)} already exists and will not be overwritten`
    );
  }
}

cli.init({
  log: {
    logFilePath: path.join(
      process.env.PWD,
      `${new Date().toISOString().replace(/[^a-z0-9-_]+/gi, '_')}-setup.log`
    )
  }
});

for (const file in template) {
  const dest = path.join(process.env.PWD, file);
  const src = path.join(__dirname, template[file]);
  if (/.+\.inc$/i.test(src)) {
    appendByLine(src, dest);
  } else if (/.+\.inc\.json$/i.test(src)) {
    appendJSON(src, dest);
  } else {
    copyFile(src, dest);
  }
}
