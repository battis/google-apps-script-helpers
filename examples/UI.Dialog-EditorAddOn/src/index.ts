import g, { include } from '@battis/gas-lighter';

/*
 * This runs as a test deployment.
 */

/*
 * Expose helper functions to app
 */
global.include = include;

/*
 * Define add-on menu
 */
global.onOpen = () => {
  SpreadsheetApp.getUi()
    .createAddonMenu()
    .addItem('Dialog', 'openDialog')
    .addToUi();
};

/*
 * Simplest implementation, assumes process will complete before script is
 * timed out
 */
global.openDialog = () => {
  g.UI.Dialog.showModal({
    root: SpreadsheetApp,
    title: 'Foo',
    message: 'argle bargle',
    buttons: ['A', 'B', 'C']
  });
};
