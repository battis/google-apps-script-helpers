import * as CacheService from '../../../CacheService';
import Component from '../Component';
import Page from '../Page';
import * as Template from '../../Template';
import css from './progress.scss';
import html from './progress.html';

const VALUE = 'value';
const MAX = 'max';
const STATUS = 'status';
const PAGE = 'page';
const COMPLETE = 'complete';

const MIN_TO_SEC = 60;
const SEC_TO_MS = 1000;

export class Progress<T = any> extends Component {
  private threadStart = Date.now();

  public getNamespace(): string {
    return 'g.HtmlService.Component.Progress';
  }

  public constructor(
    private config: Progress.Configuration = { job: undefined }
  ) {
    super(css);
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
        this.complete = {
          callback:
            typeof callback === 'string' ? callback : callback.functionName,
          args: typeof callback === 'string' ? [] : callback.args
        };
        return;
      }
    }
    this.complete = onComplete;
  }

  public getProgress() {
    const complete = this.complete;
    if (complete) {
      this.complete = undefined;
    }
    return {
      job: this.config.job,
      value: this.value,
      max: this.max,
      status: this.status,
      complete
    };
  }

  protected _html?: string;

  public getHtml(
    { mode, callback }: Progress.HtmlConfiguration = { mode: 'overlay' }
  ) {
    if (!this._html) {
      this._html = Template.create(html, {
        job: this.config.job,
        callback,
        mode
      }).getContent();
    }
    return this._html;
  }

  protected _page?: Page;

  public getPage(config: Progress.HtmlConfiguration = { mode: 'overlay' }) {
    if (!this._page) {
      this._page = new Page({ html: this.getHtml(config) }).register(this);
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

  public get complete() {
    return this.getter<Progress.Completion.Any>(COMPLETE);
  }

  public set complete(complete) {
    this.setter<Progress.Completion.Any>(COMPLETE, complete);
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

  export type Dataset<Page = any> = Page[];
  export namespace Dataset {
    export type Loader<Page = any> = (parameters: {
      page: number;
      progress: Progress;
    }) => Dataset<Page>;

    export type Handler<Page = any> = (parameters: {
      data: Page;
      progress: Progress;
    }) => void;

    export type Callback = string | { functionName: string; args: any[] };
  }
  export namespace Completion {
    export type Boolean = true;
    export type Message = string;
    export type HTML = { html: string };
    export type PageCallback = {
      callback: string;
      args: any[];
    };
    export type Any = Boolean | Message | HTML | PageCallback;
  }

  export type HtmlConfiguration = { mode: Page.Mode } & (
    | { mode: 'overlay'; callback?: never }
    | { mode: 'popup'; callback: string }
  );

  export type Configuration<Page = any> = {
    job: string;
    paging?: Configuration.Paging<Page>;
    onComplete?: Completion.Any;
    options?: Configuration.Options;
  };
  export namespace Configuration {
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
