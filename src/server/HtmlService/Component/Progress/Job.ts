import * as CacheService from '../../../CacheService';
import Base from '../Base';

abstract class Job extends Base {
  protected KEY = {
    JOB: 'job',
    COMPLETE: 'complete'
  };

  private _complete?: Job.Completion;

  public constructor(private _job = Utilities.getUuid()) {
    super();
  }

  public get job() {
    return this._job;
  }

  public get complete() {
    if (!this._complete) {
      this._complete = this.get(this.KEY.COMPLETE);
    }
    return this._complete;
  }

  public set complete(complete) {
    this._complete = complete;
    this.put(this.KEY.COMPLETE, this._complete);
  }

  protected get(token: string) {
    return Job.get(this.job, token);
  }

  public static get(job: string, token: string) {
    return CacheService.getUserCache(this.prefix(job, token));
  }

  protected put(token: string, value: any) {
    return CacheService.putUserCache(
      this.prefix(token),
      value,
      undefined,
      30 * 60
    );
  }

  // FIXME I don't think "remove" means what Google think it means
  protected remove(token: string) {
    return CacheService.removeUserCache(this.prefix(token));
  }

  protected abstract data: Record<string, any>;

  private static prefix(job: string, token: string, delimiter = '.') {
    return ['g', 'HtmlService', 'Element', 'Progress', job, token].join(
      delimiter
    );
  }

  private prefix(token: string) {
    return Job.prefix(this.job, token);
  }

  protected reset() {
    for (const key in this.KEY) {
      this.remove(key);
    }
  }
}

namespace Job {
  export type KeyableFunction = (token: string, ...args: any[]) => any;

  export type Completion =
    | string
    | true
    | { html: string }
    | { callback: string; args: any[]; page: number };
}

export { Job as default };
