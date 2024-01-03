import * as CacheService from '../../../CacheService';
import Component from '../Component';
import Page from '../../Page';
import * as Template from '../../Template';
import html from './progress.html';
import * as Callback from '../../../shared/Callback';

const VALUE = 'value';
const MAX = 'max';
const STATUS = 'status';
const PAGE = 'page';
const CALLBACK = 'callback';
const COMPLETE = 'complete';

const MIN_TO_SEC = 60;
const SEC_TO_MS = 1000;

export class Progress<T = any> implements Component {
  private threadStart = Date.now();

  public constructor(
    private config: Progress.Configuration = { job: undefined }
  ) {
    if (this.config.job === undefined) {
      this.config.job = Utilities.getUuid();
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
  }

  public static callbackUrl({
    url,
    job,
    callback
  }: {
    url: string;
    job?: string;
    callback: string;
  }) {
    return `${url}?job=${job || Utilities.getUuid()}&callback=${callback}`;
  }

  public run() {
    this.page = 0;
    const {
      paging: { loader, handler, callback },
      onComplete,
      options: {
        quotaInMinutes,
        quotaMarginInMinutes,
        pageMargin,
        ignoreErrors
      }
    } = this.config;
    // can safely ignore possibility of async loader, because UrlFetchApp is synchronous. ...right?
    const dataset = loader({ page: this.page, progress: this });
    let pageStart: number;
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
      const quotaRemaining =
        this.threadStart + quotaInMinutes * MIN_TO_SEC * SEC_TO_MS - Date.now();
      if (
        quotaRemaining <
          pageMargin * ((Date.now() - this.threadStart) / this.page) ||
        quotaRemaining < quotaMarginInMinutes * SEC_TO_MS
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
      Object.assign(message, Callback.standardize({ callback }));
    }

    const complete = this.complete;
    if (complete) {
      Object.assign(message, { complete: true });
      try {
        Object.assign(message, complete);
      } catch (e) {
        // ignore error
      }
    }

    return message;
  }

  protected _html?: string;

  public getHtml({ callback }: Progress.Configuration.HTML = {}) {
    if (!this._html) {
      this._html = Template.create(html, {
        job: this.config.job,
        ...(callback ? Callback.standardize({ callback }) : {})
      }).getContent();
    }
    return this._html;
  }

  protected _page?: Page;

  public getPage(config: Progress.Configuration.HTML = {}) {
    if (!this._page) {
      this._page = new Page({ html: this.getHtml(config) });
    }
    return this._page;
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

    export type Callback = Callback.Function;
  }

  export type Completion = boolean | Page.Message;

  export type Configuration<Page = any> = {
    job: string;
    paging?: Configuration.Paging<Page>;
    onComplete?: Completion;
    options?: Configuration.Options;
  };

  export namespace Configuration {
    export type HTML = Component.Configuration & {
      callback?: Callback.Function;
    };
    export type Paging<Page = any> = {
      loader: Dataset.Loader<Page>;
      handler: Dataset.Handler<Page>;
      callback: Dataset.Callback;
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
