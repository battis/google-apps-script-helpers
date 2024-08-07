import g, { include, getProgress } from '@battis/gas-lighter';

/*
 * This runs as a test deployment.
 *
 * PREPARATION: store the URL of the Web App test deployment as a Script
 * Property named URL
 *
 * We _should_ just be able to use ScriptApp.getService().getUrl(), but this
 * has been broken for a couple of years.
 * @see https://tanaikech.github.io/2022/06/11/report-recent-value-of-scriptapp.getservice.geturl-in-google-apps-script/
 * @see https://issuetracker.google.com/issues/235862472
 */

/*
 * Hoist globals from g
 */
global.include = include;
global.getProgress = getProgress;

/*
 * Dummy data
 */
const data = [...Array(500).keys()].map((value) => value + 1);

/*
 * Define homepage card
 */
global.onHomepage = () => {
  const url = g.PropertiesService.getScriptProperty('URL');
  const buttonConfig = {
    openAs: CardService.OpenAs.OVERLAY,
    onClose: CardService.OnClose.RELOAD_ADD_ON
  };
  return g.CardService.Card.$({
    name: 'Sandbox',
    sections: [
      g.CardService.CardSection.$({
        header: 'Sandbox',
        widgets: [
          'I like to choose!',

          /*
           * A button that launches a job tracked by a progress bar in a popup
           * window
           */
          g.CardService.Widget.TextButton.$({
            text: 'Choose',
            url,
            ...buttonConfig
          })
        ]
      })
    ]
  });
};

global.options = () => {
  return [
    { value: 'A' },
    { value: 'B', name: 'b' },
    { value: 'C', selected: true }
  ];
};

/*
 * Web handler for app to display the progress bar
 */
global.doGet = ({ parameter }: GoogleAppsScript.Events.DoGet) => {
  const picker = new g.HtmlService.Component.Picker({
    options: 'options',
    callback: 'handler'
  });
  return picker.getPage().popup({
    data: {
      title: 'Popeye!',
      label: 'foo bar baz',
      help: 'Lorem ipsum dolor'
    }
  });
};
