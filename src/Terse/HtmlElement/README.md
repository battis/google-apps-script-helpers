# HTML Elements

## Progress

### `app.ts`

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

### `stylesheet.html`

```html
<style>
  .battis.Terse.HtmlService.Element.Progress .progress {
    width: 100%;
  }
</style>
```

### `frontend.html`

```html
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
```

### `view.html`

```html
<!DOCTYPE html lang="en">
<html>
  <head>
    <?!= include('stylesheet'); ?>
  </head>
  <body>
    <div id="content">Loading…</div>
    <?!= include('frontend'); ?>
  </body>
</html>
```
