# Terse.CardService

Suggested use:

```
📁 src
 ∟📁 Card
 | ∟📄 Foo.ts
 | ∟📄 Bar.ts
 | ∟📄 index.ts
```

In `Foo.ts`:

```ts
import { Terse } from '@battis/gas-lighter';

export function getCard() {
  return Terse.CardService.newCard({
    /* ...etc. */
  });
}

export function getActionResponse() {
  return Terse.CardService.pushCard(getCard());
}

global.card_foo = getActionResponse;
export const getFunctionName = () => 'card_foo';
```

In `Bar.ts`:

```ts
import { Terse } from '@battis/gas-lighter';
import * as Foo from './Foo';

export function getCard() {
  return Terse.CardService.newCard({
    widgets: [
      Terse.CardService.newTextButton({
        text: 'Foo',
        functionName: Foo.getFunctionName(),
      }),
    ],
    /* ...etc. */
  });
}

// ...etc.
```

And, if accessing from outside the `Card` directory, deploy the magic of ES2015 modules in `index.ts`:

```ts
export * as Foo from './Foo';
export * as Bar from './Bar';
```

And then say things like `Card.Foo.getFunctionName()` or `Card.Bar.getCard()` and so forth.
