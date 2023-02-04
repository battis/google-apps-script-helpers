import C from '../CacheService';

export default class Progress {
  private key: string;
  private status?: string;
  private value: number;
  private max: number;
  private complete: boolean;

  private prefix(token: string, delimiter: string = '.') {
    return ['battis', 'Terse', 'HtmlService', 'Progress', this.key, token].join(
      delimiter
    );
  }

  private get html() {
    return this.prefix('html');
  }

  private get(key: string) {
    return C.getUserCache(this.prefix(key));
  }

  private put(key: string, value: any) {
    return C.putUserCache(
      this.prefix(key),
      typeof value == 'string' ? value : JSON.stringify(value)
    );
  }

  private remove(key: string) {
    return CacheService.getUserCache().remove(this.prefix(key));
  }

  public constructor(key: string) {
    this.key = key;
    this.reset();
  }

  private putAndUpdate(key, value) {
    this[key] = value;
    this.put(key, value);
    this.update();
  }

  public setStatus = this.putAndUpdate.bind(this, 'status');
  public getStatus = this.get.bind(this, 'status');

  public setValue = this.putAndUpdate.bind(this, 'value');
  public getValue = this.get.bind(this, 'value');

  public setMax = this.putAndUpdate.bind(this, 'max');
  public getMax = this.get.bind(this, 'max');

  public markComplete = this.put.bind(this, 'complete', true);
  public markIncomplete = this.put.bind(this, 'complete', false);
  public isComplete = this.get.bind(this, 'complete');

  private setHtml = this.put.bind(this, 'html');
  public getHtml = this.get.bind(this, 'html');

  public reset() {
    this.markIncomplete();
    this.remove('status');
    this.setValue(0);
  }

  private update() {
    this.setHtml(
      `<div class="battis Terse HtmlService Element Progress">
        <progress
          class="progress"
          value="${this.value}"
          max="${this.max}"
        />
        <div class="status">${this.status || ''}</div>
      </div>`
    );
  }
}
