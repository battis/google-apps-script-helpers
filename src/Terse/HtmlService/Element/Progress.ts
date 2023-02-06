import {
    getUserCache,
    putUserCache,
    removeUserCache
} from '../../CacheService';

/**

A progress bar

<progress value="30" max="100">status</progress>

### `app.ts`

Work with Progress object. Progress on different strands are denoted by different keywords. For convenience, an instance of Progress can be provided by `Progress.getInstance()` bound to a specific keyword/process.

```ts
import { Terse } from '@battis/gas-lighter';

const P = Terse.HtmlService.Element.Progress.getInstance('keyword');

global.action_that_needs_progress_indicator = () => {
  P.reset();
  const data = listOfStuff();
  P.setMax(max);
  ScriptApp.getUi().showModalDialog(
    HtmlService.createTemplateFromFile('view').evaluate().setHeight(100),
    'Doing Things'
  );
  data.forEach((datum, i) => {
    P.setvalue(i + 1);
    P.setStatus(datum.getSnappyTextLabel());
    doStuffWithData(datum);
  });
  P.setComplete('all done!');
};

global.helper_to_action_getProgress = P.getProgress;
```

### `view.html`

For convenience, shown as a single file. [Best practices encourage breaking HTML, CSS, Javascript into separate files](https://developers.google.com/apps-script/guides/html/best-practices) for which [`Terse.HtmlService.include()`](?page=Terse/HtmlService.Class.default#include) is a helpful tool.

```html
<!DOCTYPE html lang="en">
<html>
  <head>
    <style>
      .battis.Terse.HtmlService.Element.Progress .progress {
        width: 100%;
      }
    </style>
  </head>
  <body>
    <div id="content">Loading…</div>
    <script>
      function updateProgress() {
        google.script.run
          .withSuccessHandler((progress) => {
            if (progress.complete) {
              google.script.host.close();
            } else {
              document.getElementById('content').innerHTML = progress.html;
              updateProgress();
            }
          })
          .helper_to_action_getProgress();
      }

      updateProgress();
    </script>
  </body>
</html>
```
 */

function prefix(key: string, token: string, delimiter = '.') {
    return ['battis', 'Terse', 'HtmlService', 'Progress', key, token].join(
        delimiter
    );
}

function get(token: string, key: string) {
    return getUserCache(prefix(key, token));
}

function put(token: string, key: string, value: any) {
    return putUserCache(
        prefix(key, token),
        typeof value == 'string' ? value : JSON.stringify(value)
    );
}

// FIXME I don't think "remove" means what you think it means
function remove(token: string, key: string) {
    return removeUserCache(prefix(key, token));
}

function putAndUpdate(token: string, key: string, value: any) {
    put(token, key, value);
    update(key);
}

export const setStatus = putAndUpdate.bind(null, 'status');
export const getStatus = get.bind(null, 'status');

export const setValue = putAndUpdate.bind(null, 'value');
export const getValue = get.bind(null, 'value');

export const setMax = putAndUpdate.bind(null, 'max');
export const getMax = get.bind(null, 'max');

export const setComplete = put.bind(null, 'complete');
export const getComplete = get.bind(null, 'complete');

export const setHtml = put.bind(null, 'html');
export const getHtml = get.bind(null, 'html');

export function reset(key: string) {
    // FIXME this seems redundant, but things also aren't getting removed from the cache, so…
    setComplete(key, null);
    remove(key, 'complete');
    setStatus(key, null);
    remove(key, 'status');
    setValue(key, 0);
}

export function getProgress(key: string) {
    return { html: getHtml(key), complete: getComplete(key) };
}

function update(key: string) {
    const value = getValue(key);
    const max = getMax(key);
    setHtml(
        key,
        `<div class="battis Terse HtmlService Element Progress">
        <progress
          class="progress"
          value="${value}"
          max="${max}"
        >${value} / ${max}</progress>
        <div class="status">${getStatus(key) || ''}</div>
      </div>`
    );
}

export function getInstance(key: string) {
    return class {
        public static reset = reset.bind(null, key);
        public static getProgress = getProgress.bind(null, key);
        public static setStatus = setStatus.bind(null, key);
        public static getStatus = getStatus.bind(null, key);
        public static setValue = setValue.bind(null, key);
        public static getValue = getValue.bind(null, key);
        public static setMax = setMax.bind(null, key);
        public static getMax = getMax.bind(null, key);
        public static setComplete = setComplete.bind(null, key);
        public static getComplete = getComplete.bind(null, key);
        public static getHtml = getHtml.bind(null, key);
    };
}
