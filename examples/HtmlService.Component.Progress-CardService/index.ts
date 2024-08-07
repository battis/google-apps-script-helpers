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
const url = g.PropertiesService.getScriptProperty('URL');

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
  const buttonConfig = {
    /*
     * block input to the CardService app while the progress dialog is open
     */
    openAs: CardService.OpenAs.OVERLAY,
    onClose: CardService.OnClose.RELOAD_ADD_ON
  };
  return g.CardService.Card.$({
    name: 'Sandbox',
    sections: [
      g.CardService.CardSection.$({
        header: 'Sandbox',
        widgets: [
          'I like to count!',

          /*
           * A button that launches a job tracked by a progress bar in a popup
           * window
           */
          g.CardService.Widget.TextButton.$({
            text: 'Unpaged',
            url: `${url}?callback=theCount`,
            ...buttonConfig
          }),
          /*
           * A button that launches a paged job (i.e. one that )
           */
          g.CardService.Widget.TextButton.$({
            text: 'Paged',
            url: `${url}?callback=theCountPaged`,
            ...buttonConfig
          })
        ]
      })
    ]
  });
};

/*
 * Simplest implementation, assumes process will complete before script is
 * timed out
 */
global.theCount = (job: string) => {
  const progress = new g.HtmlService.Component.Progress({ job });
  progress.max = data.length;
  for (const d of data) {
    /*
     * Each step of the process updates the status and value of the progress
     * bar (obviously could do more!)
     *
     * There is not a 1:1 relationship between pages and the tracking value:
     * one page could update the value an arbitrary amount (or an arbitrary
     * number of times).
     */
    progress.status = `${d} bats in my belfry!`;
    progress.value++;
  }
  progress.complete = g.HtmlService.Page.Message.close();
};

/*
 * Paged implementation, tracks the time elapsed for the script. As the script
 * timeout is approached, this signals the View to restart the process from
 * the current page of the job, creating a new execution with a fresh timeout.
 */
global.theCountPaged = (job: string) => {
  return new g.HtmlService.Component.Progress({
    job,
    onComplete: g.HtmlService.Page.Message.close(),
    paging: {
      /*
       * Choose the pages of data starting at this page number
       */
      loader: ({ page, progress }) => {
        progress.max = data.length;
        progress.value = page;
        return data.slice(page);
      },

      /*
       * Handle each page of data
       */
      handler: ({ data, progress }) => {
        /*
         * Each step of the process updates the status and value of the
         * progress bar (obviously could do more!)
         *
         * There is not a 1:1 relationship between pages and the tracking
         * value: one page could update the value an arbitrary amount (or an
         * arbitrary number of times).
         */
        progress.value++;
        progress.status = `${data} bats in my belfry!`;
      },

      /*
       * callback function to handle future pages after timeout
       */
      callback: 'theCountPaged'
    },
    options: {
      quotaInMinutes: 1,
      quotaMarginInMinutes: 0
    }
  }).run();
};

/*
 * Web handler for app to display the progress bar
 */
global.doGet = ({
  parameter: { callback, ...rest }
}: GoogleAppsScript.Events.DoGet) => {
  return g.HtmlService.Page.from(
    [
      '<h1>I like to count!</h1>',
      new g.HtmlService.Component.Progress({ callback })
    ]
    /*
     * CardService apps are single-threaded, so there _must_ be a callback
     * function to run the process that is being tracked by the progress bar
     * (the CardService app thread is blocked by opening the window)
     */
  ).popup({ title: 'I like to count!', ...rest });
};
