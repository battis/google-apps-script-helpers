import E from './Element';

class H {
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
  public static include(filePath: string, data?: object) {
    const template = HtmlService.createTemplateFromFile(filePath);
    template.data = data;
    return template.evaluate().getContent();
  }
}

module H {
  export const Element = E;
}

export default H;
