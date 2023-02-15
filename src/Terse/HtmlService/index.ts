export * as Element from './Element';

/**
  ### `app.ts`
```ts
    import { Terse } from '@battis/gas-lighter';

    global.include = Terse.HtmlService.include;
    ```

    ### `view.html`
```html
<html>
  <head>
    <?!= include('stylesheet'); ?>
  </head>
  <body>
    <div>Foo</div>
    <?!= include ('frontend'); ?>
  </body>
</html>
```

     * @param {string} filePath - description
     * @param {object} data - description
     */
export function include(filePath: string, data?: object) {
    const template = HtmlService.createTemplateFromFile(filePath);
    template.data = data;
    return template.evaluate().getContent();
}

export function createTemplateFromFile(filePath: string, data?: object) {
    const template = HtmlService.createTemplateFromFile(filePath);
    template.data = data;
    return template.evaluate();
}
