import C from '../../CacheService';

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
export default class Progress {
  private constructor() {}

  private static prefix(key: string, token: string, delimiter: string = '.') {
    return ['battis', 'Terse', 'HtmlService', 'Progress', key, token].join(
      delimiter
    );
  }

  private static get(token: string, key: string) {
    return C.getUserCache(Progress.prefix(key, token));
  }

  private static put(token: string, key: string, value: any) {
    return C.putUserCache(
      Progress.prefix(key, token),
      typeof value == 'string' ? value : JSON.stringify(value)
    );
  }

  // FIXME I don't think "remove" means what you think it means
  private static remove(token: string, key: string) {
    return C.removeUserCache(Progress.prefix(key, token));
  }

  private static putAndUpdate(token: string, key: string, value: any) {
    Progress.put(token, key, value);
    Progress.update(key);
  }

  public static setStatus = Progress.putAndUpdate.bind(null, 'status');
  public static getStatus = Progress.get.bind(null, 'status');

  public static setValue = Progress.putAndUpdate.bind(null, 'value');
  public static getValue = Progress.get.bind(null, 'value');

  public static setMax = Progress.putAndUpdate.bind(null, 'max');
  public static getMax = Progress.get.bind(null, 'max');

  public static setComplete = Progress.put.bind(null, 'complete');
  public static getComplete = Progress.get.bind(null, 'complete');

  private static setHtml = Progress.put.bind(null, 'html');
  public static getHtml = Progress.get.bind(null, 'html');

  public static reset(key: string) {
    Progress.remove(key, 'complete');
    Progress.remove(key, 'status');
    Progress.setValue(key, 0);
  }

  public static getProgress(key: string) {
    return { html: Progress.getHtml(key), complete: Progress.getComplete(key) };
  }

  private static update(key: string) {
    const value = Progress.getValue(key);
    const max = Progress.getMax(key);
    Progress.setHtml(
      key,
      `<div class="battis Terse HtmlService Element Progress">
        <progress
          class="progress"
          value="${value}"
          max="${max}"
        >${value} / ${max}</progress>
        <div class="status">${Progress.getStatus(key) || ''}</div>
      </div>`
    );
  }

  public static getInstance(key: string) {
    return class KeyedProgress extends Progress {
      public static reset = Progress.reset.bind(null, key);
      public static getProgress = Progress.getProgress.bind(null, key);
      public static setStatus = Progress.setStatus.bind(null, key);
      public static getStatus = Progress.getStatus.bind(null, key);
      public static setValue = Progress.setValue.bind(null, key);
      public static getValue = Progress.getValue.bind(null, key);
      public static setMax = Progress.setMax.bind(null, key);
      public static getMax = Progress.getMax.bind(null, key);
      public static setComplete = Progress.setComplete.bind(null, key);
      public static getComplete = Progress.getComplete.bind(null, key);
      public static getHtml = Progress.getHtml.bind(null, key);
    };
  }
}
