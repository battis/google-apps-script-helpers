import g from '@battis/gas-lighter';

/*
 * This runs as a test deployment.
 *
 * PREPARATION: store the URL of the Web App test deployment as a Script Property named URL
 */

/*
 * Expose helper functions to app
 */
global.include = g.HtmlService.Template.include;
global.getProgress = g.HtmlService.Component.Progress.getProgress;

/*
 * Dummy data
 */
const data = [...Array(500).keys()].map((value) => value + 1);

/*
 * Define homepage card
 */
global.onHomepage = () => {
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
                  `${g.PropertiesService.getScriptProperty('URL')}?job=${
                    new g.HtmlService.Component.Progress.Tracker().job
                  }&callback=theCount` // <-- callback query parameter names function that starts/monitors job
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
                  `${g.PropertiesService.getScriptProperty('URL')}?job=${
                    new g.HtmlService.Component.Progress.Tracker().job
                  }&callback=theCountPaged` // <-- callback query parameter names function that starts/monitors job
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
global.theCount = (job: string, page: number = 0) => {
  const tracker = new g.HtmlService.Component.Progress.Tracker({ job });
  tracker.reset();
  tracker.max = data.length;
  for (const d of data) {
    /*
     * Each step of the process updates the status and value of the progress
     * bar (obviously could do more!)
     *
     * There is not a 1:1 relationship between pages and the tracking value:
     * one page could update the value an arbitrary amount (or an arbitrary
     * number of times).
     */
    tracker.status = `${d} bats in my belfry!`;
    tracker.value++;
  }
  tracker.complete = true;
};

/*
 * Paged implementation, tracks the time elapsed for the script. As the script
 * timeout is approached, this signals the View to restart the process from
 * the current page of the job, creating a new execution with a fresh timeout.
 */
global.theCountPaged = (job: string, page?: number) => {
  return new g.HtmlService.Component.Progress.Tracker({
    job,
    paging: {
      page,

      /*
       * Choose the pages of data starting at this page number
       */
      loader: ({ page, tracker }) => {
        tracker.max = data.length;
        tracker.value = page;
        return data.slice(page);
      },

      /*
       * Handle each page of data
       */
      handler: ({ data, tracker }) => {
        /*
         * Each step of the process updates the status and value of the
         * progress bar (obviously could do more!)
         *
         * There is not a 1:1 relationship between pages and the tracking
         * value: one page could update the value an arbitrary amount (or an
         * arbitrary number of times).
         */
        tracker.value++;
        tracker.status = `${data} bats in my belfry!`;
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
  return new g.HtmlService.Component.Progress.View({
    job: parameter.job
  }).popup({
    title: 'I like to count!',
    message: 'I see vun! two! three! bats in my belfry!',
    ...parameter
  });
};
