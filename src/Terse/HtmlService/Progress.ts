import C from '../CacheService';

export default class Progress {
  private static prefix(key: string, token: string, delimiter: string = '.') {
    return ['battis', 'Terse', 'HtmlService', 'Progress', key, token].join(
      delimiter
    );
  }

  private static get(token: string, key: string) {
    return C.getUserCache(Progress.prefix(key, token));
  }

  private static put(token: string, key: string, value: any) {
    return C.putUserCache(
      Progress.prefix(key, token),
      typeof value == 'string' ? value : JSON.stringify(value)
    );
  }

  private static remove(token: string, key: string) {
    return CacheService.getUserCache().remove(Progress.prefix(key, token));
  }

  private static putAndUpdate(token: string, key: string, value: any) {
    Progress.put(token, key, value);
    Progress.update(key);
  }

  public static setStatus = Progress.putAndUpdate.bind(null, 'status');
  public static getStatus = this.get.bind(null, 'status');

  public static setValue = Progress.putAndUpdate.bind(null, 'value');
  public static getValue = Progress.get.bind(null, 'value');

  public static setMax = Progress.putAndUpdate.bind(null, 'max');
  public static getMax = Progress.get.bind(null, 'max');

  public static setComplete = Progress.put.bind(null, 'complete');
  public static getComplete = Progress.get.bind(null, 'complete');

  private static setHtml = Progress.put.bind(null, 'html');
  public static getHtml = Progress.get.bind(null, 'html');

  public static reset(key: string) {
    this.setComplete(key, false);
    this.remove(key, 'status');
    this.setValue(key, 0);
  }

  private static update(key: string) {
    const value = Progress.getValue(key);
    const max = Progress.getMax(key);
    this.setHtml(
      key,
      `<div class="battis Terse HtmlService Element Progress">
        <progress
          class="progress"
          value="${value}"
          max="${max}"
        >${value} / ${max}</progress>
        <div class="status">${Progress.getStatus(key) || ''}</div>
      </div>`
    );
  }

  public static getInstance(key: string) {
    return class extends Progress {
      public static reset = Progress.reset.bind(null, key);
      public static setStatus = Progress.setStatus.bind(null, key);
      public static getStatus = Progress.getStatus.bind(null, key);
      public static setValue = Progress.setValue.bind(null, key);
      public static getValue = Progress.getValue.bind(null, key);
      public static setMax = Progress.setMax.bind(null, key);
      public static getMax = Progress.getMax.bind(null, key);
      public static setComplete = Progress.setComplete.bind(null, key);
      public static getComplete = Progress.getComplete.bind(null, key);
      public static getHtml = Progress.getHtml.bind(null, key);
    };
  }
}
