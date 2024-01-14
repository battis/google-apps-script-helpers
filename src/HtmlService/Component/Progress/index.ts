import * as CacheService from '../../../CacheService';
import * as Callback from '../../../shared/Callback';
import Page from '../../Page';
import * as Template from '../../Template';
import Base from '../Base';
import html from './progress.html';
import css from './progress.scss';

const VALUE = 'value';
const MAX = 'max';
const STATUS = 'status';
const PAGE = 'page';
const CALLBACK = 'callback';
const COMPLETE = 'complete';

const MIN_TO_SEC = 60;
const SEC_TO_MS = 1000;

export class Progress extends Base {
  private threadEnd: number;
  private starter?: Callback.Function;
  public readonly job: string;

  public constructor(private config: Progress.Configuration = {}) {
    super();
    if (this.config.job) {
      this.job = this.config.job;
    } else {
      this.job = Utilities.getUuid();
    }
    if (this.config.callback) {
      this.starter = this.config.callback;
    }
    if (this.config.onComplete === undefined) {
      this.config.onComplete = true;
    }
    this.config.options = {
      quotaInMinutes: 30,
      quotaMarginInMinutes: 2,
      pageMargin: 3,
      ignoreErrors: false,
      ...(this.config.options || {})
    };
    this.threadEnd =
      Date.now() +
      (this.config.options.quotaInMinutes -
        this.config.options.quotaMarginInMinutes) *
        MIN_TO_SEC *
        SEC_TO_MS;
  }

  public run() {
    const {
      paging: { loader, handler, callback },
      onComplete,
      options: { quotaMarginInMinutes, pageMargin, ignoreErrors }
    } = this.config;

    if (this.page === undefined) {
      this.page = 0;
    }
    // can safely ignore possibility of async loader, because UrlFetchApp is synchronous. ...right?
    const dataset = loader({ page: this.page, progress: this });

    let pageStart: number;
    let pageEnd: number;
    let pageDuration: number;
    let pageAverage: number;

    for (const data of dataset) {
      pageStart = Date.now();
      try {
        handler({ data, progress: this });
      } catch (e) {
        if (ignoreErrors) {
          Logger.log({
            message: 'Error processing page',
            page: this.page,
            error: e,
            job: this.config.job
          });
        } else {
          throw e;
        }
      }
      this.page++;
      pageEnd = Date.now();
      pageDuration = pageEnd - pageStart;
      pageAverage = Math.ceil(
        ((this.page - 1) *
          (pageAverage !== undefined ? pageAverage : pageDuration) +
          pageDuration) /
          this.page
      );

      if (
        pageEnd + pageMargin * pageAverage > this.threadEnd ||
        pageEnd + quotaMarginInMinutes * MIN_TO_SEC * SEC_TO_MS > this.threadEnd
      ) {
        this.callback = callback;
        return;
      }
    }
    this.complete = onComplete;
  }

  public getProgress() {
    let message = {
      job: this.config.job,
      value: this.value,
      max: this.max,
      status: this.status
    };

    let callback = this.callback;
    if (callback) {
      this.callback = undefined;
      Object.assign(message, Callback.standardize({ callback }));
    }

    const complete = this.complete;
    if (complete) {
      this.complete = undefined;
      Object.assign(message, { complete: true });
      try {
        Object.assign(message, complete);
      } catch (e) {
        // ignore error
      }
    }

    return message;
  }

  protected _html?: GoogleAppsScript.HTML.HtmlOutput;

  public getHtmlOutput(data: Template.Data = {}) {
    if (!this._html) {
      this._html = Template.create(
        html,
        {
          ...this.data,
          ...data,
          job: this.job
        },
        {
          job: this.job,
          children: this.getChildren(data),
          ...Callback.standardize(this.config.callback || '')
        }
      );
    }
    return this._html;
  }

  public getCss() {
    return css;
  }

  private prefix(token: string) {
    return ['g.HtmlService.Component.Progress', this.config.job, token].join(
      '.'
    );
  }

  public get(key: string) {
    return CacheService.getUserCache(this.prefix(key));
  }

  protected put(key: string, value: any) {
    return CacheService.putUserCache(
      this.prefix(key),
      value,
      undefined, // defaults to JSON-encoded data
      this.config.options.quotaInMinutes * MIN_TO_SEC
    );
  }

  protected remove(key: string) {
    return CacheService.removeUserCache(this.prefix(key));
  }

  public get value() {
    return this.getter<number>(VALUE);
  }

  public set value(value) {
    this.setter<number>(VALUE, value);
  }

  public get max() {
    return this.getter<number>(MAX);
  }

  public set max(max) {
    this.setter<number>(MAX, max);
  }

  public get status() {
    return this.getter<string>(STATUS);
  }

  public set status(status) {
    this.setter<string>(STATUS, status);
  }

  public get page() {
    return this.getter<number | undefined>(PAGE);
  }

  public set page(page) {
    this.setter<number | undefined>(PAGE, page);
  }

  public get callback() {
    return this.getter<Callback.Function | undefined>(CALLBACK);
  }

  public set callback(callback) {
    this.setter<Callback.Function | undefined>(CALLBACK, callback);
  }

  public get complete() {
    return this.getter<Progress.Completion>(COMPLETE);
  }

  public set complete(complete) {
    this.setter<Progress.Completion>(COMPLETE, complete);
  }

  private getter<T>(key: string): T {
    if (!this[`_${key}`]) {
      this[`_${key}`] = this.get(key);
    }
    return this[`_${key}`];
  }

  private setter<T>(key: string, value: T) {
    this[`_${key}`] = value;
    this.put(key, value);
  }
}

export namespace Progress {
  export type JobId = string;

  export function getProgress(job: JobId) {
    return new Progress({ job }).getProgress();
  }

  export type Dataset<Page = any> = Iterable<Page>;

  export namespace Dataset {
    export type Loader<Page = any> = (parameters: {
      page: number;
      progress: Progress;
    }) => Dataset<Page>;

    export type Handler<Page = any> = (parameters: {
      data: Page;
      progress: Progress;
    }) => void;
  }

  export type Completion = boolean | Page.Message;

  export type Configuration<Page = any> = {
    job?: string;
    callback?: Callback.Function;
    paging?: Configuration.Paging<Page>;
    onComplete?: Completion;
    options?: Configuration.Options;
  };

  export namespace Configuration {
    export type HTML = Base.Configuration & {
      callback?: Callback.Function;
    };
    export type Paging<Page = any> = {
      loader: Dataset.Loader<Page>;
      handler: Dataset.Handler<Page>;
      callback: Callback.Function;
    };
    export type Options = {
      quotaInMinutes?: number;
      ignoreErrors?: boolean;
      quotaMarginInMinutes?: number;
      pageMargin?: number;
    };
  }
}

export default Progress;
