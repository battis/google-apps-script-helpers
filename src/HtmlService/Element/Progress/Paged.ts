import * as UI from '../../../UI';
import Progress from './Progress';

class Paged<Page = any> extends Progress {
  /** @see {@link https://developers.google.com/apps-script/guides/services/quotas Quotas for Google Services} */
  private static MAX_SIMULTANEOUS_EXECUTIONS = 30; // scripts
  private static MAX_EXECUTION_LENGTH = 30; // minutes, 6 for free accounts, 30 for paid

  private modal: Parameters<InstanceType<typeof Progress>['showModalDialog']>;

  /** @deprecated use tuple format for modal argument */
  public constructor(
    thread: string,
    modal: { root: UI.Dialog.Root; title: string; height?: number },
    loader: Paged.Dataset.Loader<Page>,
    handler: Paged.Dataset.Handler<Page>,
    callback: string | { function: string; args: any[] },
    step?: number,
    completion?: Progress.Completion,
    ignoreErrors?: boolean,
    quotaMargin?: number,
    pageMargin?: number
  );
  public constructor(
    thread: string,
    modal: Parameters<InstanceType<typeof Progress>['showModalDialog']>,
    loader: Paged.Dataset.Loader<Page>,
    handler: Paged.Dataset.Handler<Page>,
    callback: string | { function: string; args: any[] },
    step?: number,
    completion?: Progress.Completion,
    ignoreErrors?: boolean,
    quotaMargin?: number,
    pageMargin?: number
  );
  public constructor(
    thread: string,
    modal:
      | { root: UI.Dialog.Root; title: string; height?: number }
      | Parameters<InstanceType<typeof Progress>['showModalDialog']>,
    private loader: Paged.Dataset.Loader<Page>,
    private handler: Paged.Dataset.Handler<Page>,
    private callback: string | { function: string; args: any[] },
    step = 0,
    private completion: Progress.Completion = true,
    private ignoreErrors = true,
    private quotaMargin = 1,
    private pageMargin = 2
  ) {
    super(thread);
    if (!Array.isArray(modal)) {
      const { root, title, height } = modal;
      this.modal = [root, title, height];
    } else {
      this.modal = modal;
    }
    this.run(step);
  }

  private run(step = 0) {
    const end =
      new Date().getTime() +
      (Paged.MAX_EXECUTION_LENGTH - this.quotaMargin) * 60 * 1000;
    if (step == 0) {
      this.showModalDialog(...this.modal);
    }
    const dataset = this.loader(step);
    let averagePage: number;
    let counter = 1;
    for (const page of dataset) {
      const pageStart = new Date().getTime();
      if (this.ignoreErrors) {
        try {
          this.handler(page);
        } catch (e) {
          Logger.log({
            message: `Error processing page`,
            page,
            error: e,
            thread: this.job
          });
        }
      } else {
        this.handler(page);
      }

      if (averagePage) {
        averagePage =
          (averagePage * counter + (new Date().getTime() - pageStart)) /
          (counter + 1);
      } else {
        averagePage = new Date().getTime() - pageStart;
      }
      if (new Date().getTime() + averagePage * this.pageMargin > end) {
        let args = [];
        let callback = this.callback;
        if (typeof this.callback === 'object') {
          args = this.callback.args || [];
          callback = this.callback.function;
        }
        this.complete = {
          callback: callback,
          args,
          step: step + counter
        };
        return;
      }
      counter++;
    }
    this.complete = this.completion;
  }
}

namespace Paged {
  export type Completion =
    | Progress.Completion
    | { callback: string; step: number; args?: any[] };
  export namespace Dataset {
    export type Loader<Page> = (start: number, end?: number) => Dataset<Page>;
    export type Handler<Page> = (page: Page) => void;
  }
  export type Dataset<Page> = Iterable<Page>;
}

export { Paged as default };
