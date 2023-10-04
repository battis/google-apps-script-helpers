import Base from '../Base';
import View from './View';
import Kind from './Kind';
import Key from './Key';
import Completion from './Completion';
import ITracker from '../Tracker';

class Tracker<Page = any> extends Base.Tracker {
  /** @see {@link https://developers.google.com/apps-script/guides/services/quotas Quotas for Google Services} */
  //private static readonly MAX_SIMULTANEOUS_EXECUTIONS = 30; // scripts
  private static readonly MAX_EXECUTION_LENGTH = 30; // minutes, 6 for free accounts, 30 for paid

  public constructor(params: Tracker.Parameters.constructor<Page>) {
    super(params.job);
    //this.kind = Kind;
    this.put(Key.EndTime, '?');

    params = {
      step: 0,
      completion: true,
      ignoreErrors: true,
      quotaMargin: 1,
      pageMargin: 2,
      run: true,
      ...params
    };

    if (params.run) {
      this.run(params);
    }
  }

  protected endTime(averagePage: number) {
    let s = ((this.max - this.value) * averagePage) / 1000;
    const h = Math.trunc(s / 3600);
    s = s % 3600;
    const m = Math.trunc(s / 60);
    s = s % 60;
    const pad = (n) => (n < 10 ? `0${n}` : n);
    this.put(Key.EndTime, `${h}:${pad(m)}:${pad(s)}`);
  }

  private run(params: Tracker.Parameters.run<Page>) {
    const end =
      new Date().getTime() +
      (Tracker.MAX_EXECUTION_LENGTH - params.quotaMargin) * 60 * 1000;
    let averagePage: number;
    if (params.step == 0 && params.modal) {
      this.view.showModalDialog(...params.modal);
    }
    const dataset = params.loader({ start: params.step, tracker: this });
    let counter = 1;
    for (const page of dataset) {
      const pageStart = new Date().getTime();
      if (params.ignoreErrors) {
        try {
          params.handler({ page, tracker: this });
        } catch (e) {
          Logger.log({
            message: `Error processing page`,
            page,
            error: e,
            job: this.job
          });
        }
      } else {
        params.handler({ page, tracker: this });
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
          callback = params.callback.functionName;
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
  export namespace Parameters {
    export type run<Page> = {
      modal?: Parameters<InstanceType<typeof View>['showModalDialog']>;
      loader: ITracker.Dataset.Loader<Page>;
      handler: ITracker.Dataset.Handler<Page>;
      callback: ITracker.Dataset.Callback;
      step?: number;
      completion?: Completion;
      ignoreErrors?: boolean;
      quotaMargin?: number; // in minutes
      pageMargin?: number; // in average time per step
      run?: boolean;
    };

    export type constructor<Page> = run<Page> & {
      job: string;
    };
  }
}

export { Tracker as default };
