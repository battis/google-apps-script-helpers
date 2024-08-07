import g from '@battis/gas-lighter';

global.onHomepage = () => {
  return g.CardService.Card.$({
    header: 'Welcome!',
    widgets: [
      'Lorem ipsum dolor.',
      g.CardService.Widget.TextButton.$({
        text: 'Example',
        url: 'https://example.com'
      })
    ]
  });
};
