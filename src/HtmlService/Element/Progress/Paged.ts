import * as UI from '../../../UI';
import paged from './paged.html';
import Progress from './Progress';

type PagedParameters<Page> = {
  job: string;
  modal?:
  | { root: UI.Dialog.Root; title: string; height?: number }
  | Parameters<InstanceType<typeof Progress>['showModalDialog']>;
  loader: Paged.Dataset.Loader<Page>;
  handler: Paged.Dataset.Handler<Page>;
  callback: string | { function: string; args: any[] };
  step?: number;
  completion?: Progress.Completion;
  ignoreErrors?: boolean;
  quotaMargin?: number; // in minutes
  pageMargin?: number; // in average time per step
};

class Paged<Page = any> extends Progress {
  /** @see {@link https://developers.google.com/apps-script/guides/services/quotas Quotas for Google Services} */
  private static MAX_SIMULTANEOUS_EXECUTIONS = 30; // scripts
  private static MAX_EXECUTION_LENGTH = 30; // minutes, 6 for free accounts, 30 for paid

  private modal: Parameters<InstanceType<typeof Progress>['showModalDialog']>;
  private averagePage = 100;

  public constructor(params: PagedParameters<Page>);
  /** @deprecated use object parameter for better readability */
  public constructor(
    job: string,
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
  /** @deprecated use object parameter for better readability */
  public constructor(
    job: string,
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
  /** @deprecated use object parameter for better readability */
  public constructor(
    job: string,
    modal: undefined,
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
    job: string | PagedParameters<Page>,
    modal?:
      | { root: UI.Dialog.Root; title: string; height?: number }
      | Parameters<InstanceType<typeof Progress>['showModalDialog']>,
    private loader?: Paged.Dataset.Loader<Page>,
    private handler?: Paged.Dataset.Handler<Page>,
    private callback?: string | { function: string; args: any[] },
    step = 0,
    private completion: Progress.Completion = true,
    private ignoreErrors = true,
    private quotaMargin = 1,
    private pageMargin = 2
  ) {
    super(typeof job === 'object' ? job.job : job);

    this.hookTemplate = () => paged;
    this.hookTemplateData = this.endTime;

    const params: PagedParameters<Page> =
      typeof job === 'object'
        ? {
          step: 0,
          completion: true,
          ignoreErrors: true,
          quotaMargin: 1,
          pageMargin: 2,
          ...job
        }
        : {
          job,
          modal,
          loader,
          handler,
          callback,
          step,
          completion,
          ignoreErrors,
          quotaMargin,
          pageMargin
        };
    if (params.modal) {
      if (!Array.isArray(params.modal)) {
        const { root, title, height } = params.modal;
        this.modal = [root, title, height];
      } else {
        this.modal = params.modal;
      }
    }
    this.loader = params.loader;
    this.handler = params.handler;
    this.callback = params.callback;
    this.completion = params.completion;
    this.ignoreErrors = params.ignoreErrors;
    this.quotaMargin = params.quotaMargin;
    this.pageMargin = params.pageMargin;

    this.run(params.step);
  }

  protected endTime(): { [key: string]: any } {
    let s = ((this.max - this.value) * this.averagePage) / 1000;
    const h = Math.trunc(s / 3600);
    s = s % 3600;
    const m = Math.trunc(s / 60);
    s = s % 60;
    const pad = (n) => (n < 10 ? `0${n}` : n);
    return { endTime: `${h}:${pad(m)}:${pad(s)}` };
  }

  private run(step = 0) {
    const end =
      new Date().getTime() +
      (Paged.MAX_EXECUTION_LENGTH - this.quotaMargin) * 60 * 1000;
    if (step == 0 && this.modal) {
      this.showModalDialog(...this.modal);
    }
    const dataset = this.loader(step);
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
            job: this.job
          });
        }
      } else {
        this.handler(page);
      }

      if (this.averagePage) {
        this.averagePage =
          (this.averagePage * counter + (new Date().getTime() - pageStart)) /
          (counter + 1);
      } else {
        this.averagePage = new Date().getTime() - pageStart;
      }
      if (new Date().getTime() + this.averagePage * this.pageMargin > end) {
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
        this.max = this.max; // refresh cache
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
