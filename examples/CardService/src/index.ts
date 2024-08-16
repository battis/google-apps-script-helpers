import { CardService } from 'gas-lighter';

declare const global: Record<string, any>;

global.onHomepage = () => {
  return CardService.Card.$({
    header: 'Welcome!',
    widgets: [
      'Lorem ipsum dolor.',
      CardService.Widget.TextButton.$({
        text: 'Example',
        url: 'https://example.com'
      })
    ]
  });
};
