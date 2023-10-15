import View from './View';
import Job from './Job';

class Tracker<Page = any> extends Job {
  /** @see {@link https://developers.google.com/apps-script/guides/services/quotas Quotas for Google Services} */
  //private static readonly MAX_SIMULTANEOUS_EXECUTIONS = 30; // scripts
  private static readonly MAX_EXECUTION_LENGTH = 30; // minutes, 6 for free accounts, 30 for paid

  protected KEY = Object.assign(this.KEY, {
    ...super.KEY,
    STATUS: 'status',
    VALUE: 'value',
    MAX: 'max',
    END_TIME: 'endTime',
    CALLBACK: 'callback'
  });

  private _status?: string;

  public get status() {
    if (!this._status) {
      this._status = this.get(this.KEY.STATUS);
    }
    return this._status;
  }

  public set status(status) {
    this._status = status;
    this.put(this.KEY.STATUS, this._status);
  }

  private _value?: number;

  public get value() {
    if (!this._value) {
      this._value = this.get(this.KEY.VALUE);
    }
    return this._value;
  }

  public set value(value) {
    this._value = value;
    this.put(this.KEY.VALUE, this._value);
  }

  private _max?: number;

  public get max() {
    if (!this._max) {
      this._max = this.get(this.KEY.MAX);
    }
    return this._max;
  }

  public set max(max) {
    this._max = max;
    this.put(this.KEY.MAX, this._max);
  }

  private _endTime?: string;

  public get endTime() {
    if (!this._endTime) {
      this._endTime = this.get(this.KEY.END_TIME);
    }
    return this._endTime;
  }

  private set endTime(endTime) {
    this._endTime = endTime;
    this.put(this.KEY.END_TIME, this._endTime);
  }

  private _callback?: string;

  private get callback() {
    if (!this._callback) {
      this._callback = this.get(this.KEY.CALLBACK);
    }
    return this._callback;
  }

  private set callback(callback) {
    this._callback = callback;
    this.put(this.KEY.CALLBACK, this._callback);
  }

  private _view?: View;

  public get view() {
    if (!this._view) {
      this._view = new View({ job: this.job, tracker: this });
    }
    return this._view;
  }

  private updateEndTime(averagePageDurationInMilliseconds: number) {
    const pad = (n) => (n < 10 ? `0${n}` : n);

    let s =
      ((this.max - this.value) * averagePageDurationInMilliseconds) / 1000;
    const h = Math.trunc(s / 3600);
    s = s % 3600;
    const m = Math.trunc(s / 60);
    s = s % 60;

    this.endTime = `${h}:${pad(m)}:${pad(s)}`;
  }

  public get data() {
    return {
      [this.KEY.STATUS]: this.status,
      [this.KEY.VALUE]: this.value,
      [this.KEY.MAX]: this.max,
      [this.KEY.END_TIME]: this.endTime,
      [this.KEY.COMPLETE]: this.complete,
      [this.KEY.CALLBACK]: this.callback
    };
  }

  private runParameters: Tracker.Params.Run<Page>;

  public constructor(
    { job, ...parameters }: Tracker.Params.Constructor<Page> = {
      job: Utilities.getUuid(),
      onComplete: true
    }
  ) {
    super(job);
    this.runParameters = parameters;
  }

  public run() {
    const {
      paging: { page: p = 0, loader, handler, callback },
      onComplete,
      options: { ignoreErrors = true, quotaMarginInMinutes = 1, pageMargin = 2 }
    } = this.runParameters;
    let page = p;
    const end =
      new Date().getTime() +
      (Tracker.MAX_EXECUTION_LENGTH - quotaMarginInMinutes) * 60 * 1000;
    let averagePage: number;
    const dataset = loader({ page, tracker: this });
    for (const data of dataset) {
      const pageStart = new Date().getTime();
      try {
        handler({ data, tracker: this });
      } catch (e) {
        if (ignoreErrors) {
          Logger.log({
            message: `Error processing page`,
            page,
            error: e,
            job: this.job
          });
        } else {
          throw e;
        }
      }

      if (averagePage) {
        averagePage =
          (averagePage * page + (new Date().getTime() - pageStart)) /
          (page + 1);
      } else {
        averagePage = new Date().getTime() - pageStart;
      }
      if (new Date().getTime() + averagePage * pageMargin > end) {
        let args = [];
        let cb = callback;
        if (typeof cb === 'object') {
          args = cb.args || [];
          cb = cb.functionName;
        }
        this.callback = cb;
        this.complete = {
          callback: cb,
          args,
          page: page + 1
        };
        return;
      }
      this.updateEndTime(averagePage);
      page++;
    }
    this.complete = 'foo bar baz'; //onComplete;
  }

  public reset(resetView = true) {
    super.reset();
    for (const key in this.KEY) {
      this.remove(key);
    }
    if (resetView) {
      this.view.reset(false);
    }
  }
}

namespace Tracker {
  export namespace Params {
    export type Run<Page = any> = {
      paging?: {
        page?: number;
        loader: Dataset.Loader<Page>;
        handler: Dataset.Handler<Page>;
        callback: Dataset.Callback;
      };
      onComplete?: Job.Completion;
      options?: {
        ignoreErrors?: boolean;
        quotaMarginInMinutes?: number;
        pageMargin?: number;
      };
    };

    export type Constructor<Page = any> = Run<Page> & {
      job?: string;
    };
  }

  export type Dataset<Page = any> = Iterable<Page>;

  export namespace Dataset {
    export type Callback = string | { functionName: string; args: any[] };

    export type Loader<Page = any> = (parameters: {
      page: number;
      tracker: Tracker;
    }) => Dataset<Page>;

    export type Handler<Page = any> = (parameters: {
      data: Page;
      tracker: Tracker;
    }) => void;
  }
}

export { Tracker as default };
