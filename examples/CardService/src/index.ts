import * as g from 'gas-lighter';

declare const global: Record<string, any>;

global.onHomepage = () => {
  return g.CardService.Card.$({
    header: 'Welcome!',
    widgets: [
      CardService.newImage().setImageUrl(
        'https://battis.github.io/gas-lighter/assets/logo.png'
      ),
      'Est occaecat dolor nisi. Dolor nisi nostrud do excepteur tempor. Nostrud do excepteur, tempor est nulla est. Tempor est nulla est anim consequat. Nulla est anim consequat eiusmod ullamco.',
      g.CardService.Widget.TextButton.$({
        text: 'Example',
        url: 'https://example.com'
      })
    ]
  });
};
