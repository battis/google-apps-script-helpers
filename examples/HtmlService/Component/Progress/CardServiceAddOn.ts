import g, { include, getProgress } from '@battis/gas-lighter';

/*
 * This runs as a test deployment.
 *
 * PREPARATION: store the URL of the Web App test deployment as a Script Property named URL
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
  return g.CardService.Card.create({
    name: 'Sandbox',
    sections: [
      g.CardService.Card.newCardSection({
        header: 'Sandbox',
        widgets: [
          'I like to count!',

          /*
           * A button that launches a job tracked by a progress bar in a popup
           * window
           */
          CardService.newTextButton()
            .setText('Unpaged')
            .setOpenLink(
              CardService.newOpenLink()
                .setUrl(
                  g.HtmlService.Component.Progress.callbackUrl({
                    url,
                    callback: 'theCount'
                  })
                )
                .setOpenAs(CardService.OpenAs.OVERLAY)
                .setOnClose(CardService.OnClose.RELOAD_ADD_ON)
            ),

          /*
           * A button that launches a paged job (i.e. one that )
           */
          CardService.newTextButton()
            .setText('Paged')
            .setOpenLink(
              CardService.newOpenLink()
                .setUrl(
                  g.HtmlService.Component.Progress.callbackUrl({
                    url,
                    callback: 'theCountPaged'
                  })
                )
                .setOpenAs(CardService.OpenAs.OVERLAY)
                .setOnClose(CardService.OnClose.RELOAD_ADD_ON)
            )
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
      quotaMarginInMinutes: 29, // restart process when closer than 29 minutes to the 30-minute timeout (i.e. every 1 minute)
      pageMargin: 50 // restart process when than an estimated 50 pages of processing time to the 30-minute timeout
    }
  }).run();
};

/*
 * Web handler for app to display the progress bar
 */
global.doGet = ({ parameter }: GoogleAppsScript.Events.DoGet) => {
  const { job, callback } = parameter;
  return (
    new g.HtmlService.Component.Progress({
      job
    })
      /*
       * CardService apps are single-threaded, so there _must_ be a callback
       * function to run the process that is being tracked by the progress bar
       * (the CardService app thread is blocked by opening the window)
       */
      .getPage({ callback })
      .popup({
        data: { title: 'I like to count!' },
        ...parameter
      })
  );
};
