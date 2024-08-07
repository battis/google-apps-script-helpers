#!/usr/bin/env node
import cli from '@battis/qui-cli';
import fs from 'fs';
import path from 'path';

const __filename = process.argv[1].replace(
  /\/\.bin\/.*$/,
  '/@battis/gas-lighter/bin/setup.mjs'
);
const __dirname = path.dirname(__filename);

const templateDir = path.join('../template');
const template = {
  '.claspignore': path.join(templateDir, 'claspignore'),
  '.gitignore': path.join(templateDir, 'gitignore.inc'),
  '.npmrc': path.join(templateDir, 'npmrc.inc'),
  'package.json': path.join(templateDir, 'package.inc.json'),
  'tsconfig.json': path.join(templateDir, 'tsconfig.json'),
  'webpack.config.js': path.join(templateDir, 'webpack.config.js')
};

function appendByLine(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.copyFileSync(src, dest);
    cli.log.info(`Wrote ${path.basename(dest)}`);
  } else {
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
        appended.length
          ? appended.map((v) => cli.colors.value(v)).join(', ')
          : 'nothing'
      } to ${path.basename(dest)}`
    );
  }
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
        ? ` excluding ${cli.colors.value(
            JSON.stringify(result.skipped, null, 2)
          )}`
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
      process.cwd(),
      `${new Date().toISOString().replace(/[^a-z0-9-_]+/gi, '_')}-setup.log`
    )
  }
});

for (const file in template) {
  const dest = path.join(process.cwd(), file);
  const src = path.join(__dirname, template[file]);
  if (/.+\.inc$/i.test(src)) {
    appendByLine(src, dest);
  } else if (/.+\.inc\.json$/i.test(src)) {
    appendJSON(src, dest);
  } else {
    copyFile(src, dest);
  }
}

if (!fs.existsSync(path.join(process.cwd(), '.clasp.json'))) {
  if (
    await cli.prompts.confirm({
      message: 'Are you cloning an existing Google Apps Script project?'
    })
  ) {
    const id = await cli.prompts.input({
      message: `Enter the project ID (e.g. ${cli.colors.value(
        'https://script.google.com/home/projects/'
      )}${cli.colors.url(
        'euhfmDECZ9nUV7kuTojj6t9qqh9Qt2gWdFGQ2HEQmPGtFLaheDdCw8idj'
      )}${cli.colors.value('/edit')})`
    });
    cli.shell.exec(`npx clasp clone ${id}`);
  } else {
    const name = await cli.prompts.input({ message: 'Enter the project name' });
    cli.shell.exec(`npx clasp create --type=standalone "${name}"`);
  }
} else {
  const id = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), '.clasp.json')).toString()
  ).scriptId;
  cli.log.info(
    `Project already bound to script ${cli.colors.value(id)} by clasp`
  );
}
