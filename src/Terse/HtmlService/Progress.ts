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

  private static putAndUpdate(token, key, value) {
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
  public static isComplete = Progress.get.bind(null, 'complete');

  private static setHtml = Progress.put.bind(null, 'html');
  public static getHtml = Progress.get.bind(null, 'html');

  public static reset(key: string) {
    this.setComplete(key, false);
    this.remove(key, 'status');
    this.setValue(key, 0);
  }

  private static update(key: string) {
    this.setHtml(
      key,
      `<div class="battis Terse HtmlService Element Progress">
        <progress
          class="progress"
          value="${Progress.getValue(key)}"
          max="${Progress.getMax(key)}"
        />
        <div class="status">${Progress.getStatus(key) || ''}</div>
      </div>`
    );
  }
}
