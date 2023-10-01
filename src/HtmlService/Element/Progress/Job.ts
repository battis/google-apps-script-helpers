import * as gCacheService from '../../../CacheService';

export default class Job {
  public constructor(private _job = Utilities.getUuid()) {}

  public get job(): string {
    return this._job;
  }

  protected get(token: string) {
    return gCacheService.getUserCache(this.prefix(token));
  }

  public static get(job: string, token: string) {
    return gCacheService.getUserCache(this.prefix(job, token));
  }

  protected put(token: string, value: any) {
    return gCacheService.putUserCache(
      this.prefix(token),
      value,
      undefined,
      30 * 60
    );
  }

  // FIXME I don't think "remove" means what Google think it means
  public remove(token: string) {
    return gCacheService.removeUserCache(this.prefix(token));
  }

  private static prefix(job: string, token: string, delimiter = '.') {
    return [
      'bHSEP' /*battis', 'HtmlService', 'Element', 'Progress'*/,
      job,
      token
    ].join(delimiter);
  }

  private prefix(token: string) {
    return Job.prefix(this.job, token);
  }
}
