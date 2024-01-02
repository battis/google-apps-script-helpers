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
 * Define add-on menu
 */
global.onOpen = () => {
  SpreadsheetApp.getUi()
    .createAddonMenu()
    .addItem('Unpaged', 'theCount')
    .addItem('Paged', 'theCountPaged')
    .addToUi();
};

/*
 * Simplest implementation, assumes process will complete before script is
 * timed out
 */
global.theCount = () => {
  const progress = new g.HtmlService.Component.Progress();
  progress
    .getPage()
    .modal({ root: SpreadsheetApp, height: 100, data: { title: 'The Count' } });
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
  progress.complete = true;
};

/*
 * Paged implementation, tracks the time elapsed for the script. As the script
 * timeout is approached, this signals the View to restart the process from
 * the current page of the job, creating a new execution with a fresh timeout.
 */
global.theCountPaged = (job?: string) => {
  const progress = new g.HtmlService.Component.Progress({
    job,
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
  });
  progress
    .getPage()
    .modal({ root: SpreadsheetApp, height: 100, data: { title: 'The Count' } });
  progress.run();
};
