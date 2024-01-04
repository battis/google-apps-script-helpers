# @battis/gas-lighter

[![npm version](https://badge.fury.io/js/@battis%2Fgas-lighter.svg)](https://badge.fury.io/js/@battis%2Fgas-lighter)
[![Module type: CJS](https://img.shields.io/badge/module%20type-cjs-brightgreen)](https://nodejs.org/api/modules.html#modules-commonjs-modules)

_or: "my kingdom for a progress bar!"_

## Install

```bash
npm i @battis/gas-lighter
npx clasp login # if not already logged in
npx --package=@battis/gas-lighter -- setup
```

## Use

Less verbose CardService apps.

<img src="./docs/images/README/cardservice.png" style="zoom: 50%"/>

```ts
import g from '@battis/gas-lighter';

global.onHomePage = () => {
  return g.CardService.create({
    header: 'Welcome!'
    widgets: {
      'Lorem ipsum dolor.',
      g.CardService.Widget.newTextButton({
        text: 'Example',
        url: 'https://example.com'
      })
    }
  })
}
```

Nicer UI (with longer-running scripts).

<img src="./docs/images/README/progress.png" style="zoom: 50%"/>

```ts
import g, {import, getProgress} from '@battis/gas-lighter';

global.include = include;
global.getProgress = getProgress;

// ...

global.jobThatExceedsScriptTimoutLimit(job?: string) {
  const progress = new g.HtmlService.Component.Progress({
    job,
    onComplete: g.HtmlService.Page.Message.close(),
    paging: {
      loader: ({ page, progress }) => {
        // ...return an iterable object starting at `page` of your data to be processed by `handler()`
        progress.max = 1000;
      },
      handler: ({ data, progress }) => {
        // ...process a page of your data
        progress.value++;
        progress.status = `Working on it`;
      },
      callback: 'jobThatExceedsScriptTimoutLimit'
    }
  });
  if (!job) {
    progress.getPage().modal({
      root: SpreadsheetApp,
      height: 100,
      data: { title: 'The Big One' }
    });
  }
  progress.run();
}

// ...

```

More in [examples](./examples).
