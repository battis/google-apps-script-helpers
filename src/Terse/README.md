# Terse

Classes and modules that make it easier to write less verbose Google Apps Script apps. (So far this exclusively applies to the Services provided by Google Apps Script.)

## Usage

### `Code.ts`

```ts
import { Terse } from '@battis/gas-lighter';

global.include = Terse.HtmlService.include;
```
