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

global.include = Terse.HtmlService.include;

global.action_that_needs_progress_indicator = () => {
  const thread = Uitilities.getUuid();
  const p = Terse.HtmlService.Element.Progress.getInstance(thread);
  p.reset();
  const data = listOfStuff();
  p.setMax(max);
  ScriptApp.getUi().showModalDialog(
    Terse.HtmlService.createTemplateFromFile('view', { thread }).setHeight(100),
    'Doing Things'
  );
  data.forEach((datum, i) => {
    p.setvalue(i + 1);
    P.setStatus(datum.getSnappyTextLabel());
    doStuffWithData(datum);
  });
  P.setComplete('all done!');
};

global.helper_to_action_getProgress = (thread: string) =>
  Terse.HtmlService.Element.Progress.getProgress(thread);
```

### `view.html`

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
    <!?= include('script', data); ?>
  </body>
</html>
```

### `script.html`
<script>
  const thread = '<?= data.thread ?>';

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
      .helper_to_action_getProgress(thread);
  }

  updateProgress();
</script>
```html
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
    return putUserCache(prefix(key, token), value);
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
    remove(key, 'complete');
    remove(key, 'status');
    setValue(key, 0);
}

export function getProgress(key: string) {
    return { html: getHtml(key), complete: getComplete(key) };
}

// TODO add indeterminate option
// TODO add timer display/estimate
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
