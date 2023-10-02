import BaseTracker from '../Base/Tracker';
import View from './View';
import Common from './Common';

type RunParameters<Page> = {
  modal?: Parameters<InstanceType<typeof View>['showModalDialog']>;
  loader: Tracker.Dataset.Loader<Page>;
  handler: Tracker.Dataset.Handler<Page>;
  callback: string | { function: string; args: any[] };
  step?: number;
  completion?: Common.Completion;
  ignoreErrors?: boolean;
  quotaMargin?: number; // in minutes
  pageMargin?: number; // in average time per step
};

type ConstructorParameters<Page> = RunParameters<Page> & {
  job: string;
};

class Tracker<Page = any> extends BaseTracker {
  /** @see {@link https://developers.google.com/apps-script/guides/services/quotas Quotas for Google Services} */
  //private static readonly MAX_SIMULTANEOUS_EXECUTIONS = 30; // scripts
  private static readonly MAX_EXECUTION_LENGTH = 30; // minutes, 6 for free accounts, 30 for paid

  public constructor(params: ConstructorParameters<Page>) {
    super(params.job);
    this.kind = Common.KIND;
    this.put(Common.KEY_END_TIME, '?');

    params = {
      step: 0,
      completion: true,
      ignoreErrors: true,
      quotaMargin: 1,
      pageMargin: 2,
      ...params
    };

    this.run(params);
  }

  protected endTime(averagePage: number) {
    let s = ((this.max - this.value) * averagePage) / 1000;
    const h = Math.trunc(s / 3600);
    s = s % 3600;
    const m = Math.trunc(s / 60);
    s = s % 60;
    const pad = (n) => (n < 10 ? `0${n}` : n);
    this.put(Common.KEY_END_TIME, `${h}:${pad(m)}:${pad(s)}`);
  }

  private run(params: RunParameters<Page>) {
    const end =
      new Date().getTime() +
      (Tracker.MAX_EXECUTION_LENGTH - params.quotaMargin) * 60 * 1000;
    let averagePage: number;
    if (params.step == 0 && params.modal) {
      this.view.showModalDialog(...params.modal);
    }
    const dataset = params.loader(params.step);
    let counter = 1;
    for (const page of dataset) {
      const pageStart = new Date().getTime();
      if (params.ignoreErrors) {
        try {
          params.handler(page);
        } catch (e) {
          Logger.log({
            message: `Error processing page`,
            page,
            error: e,
            job: this.job
          });
        }
      } else {
        params.handler(page);
      }

      if (averagePage) {
        averagePage =
          (averagePage * counter + (new Date().getTime() - pageStart)) /
          (counter + 1);
      } else {
        averagePage = new Date().getTime() - pageStart;
      }
      if (new Date().getTime() + averagePage * params.pageMargin > end) {
        let args = [];
        let callback = params.callback;
        if (typeof params.callback === 'object') {
          args = params.callback.args || [];
          callback = params.callback.function;
        }
        this.complete = {
          callback: callback,
          args,
          step: params.step + counter
        };
        return;
      }
      this.endTime(averagePage);
      counter++;
    }
    this.complete = params.completion;
  }
}

namespace Tracker {
  export namespace Dataset {
    export type Loader<Page> = (start: number, end?: number) => Dataset<Page>;
    export type Handler<Page> = (page: Page) => void;
  }
  export type Dataset<Page> = Iterable<Page>;
}

export { Tracker as default };
