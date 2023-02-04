import C from '../CacheService';

export default class Progress {
  private static instances: { [key: string]: Progress } = {};

  private key: string;
  private defaultStatus: string;

  private prefix(token: string, delimiter: string = '.') {
    return ['battis', 'Terse', 'HtmlService', 'Progress', this.key, token].join(
      delimiter
    );
  }

  private get status() {
    return this.prefix('status');
  }

  private get value() {
    return this.prefix('value');
  }

  private get max() {
    return this.prefix('max');
  }

  private get complete() {
    return this.prefix('complete');
  }

  private get(key: string) {
    return C.getUserCache(key);
  }

  private put(key: string, value: any) {
    return C.putUserCache(
      key,
      typeof value == 'string' ? value : JSON.stringify(value)
    );
  }

  private remove(key: string) {
    return CacheService.getUserCache().remove(key);
  }

  public constructor(key: string, defaultStatus: string = 'Working…') {
    this.key = key;
    this.defaultStatus = defaultStatus;
    if (Progress.instances[key]) {
      Object.assign(this, Progress.instances[key]);
    } else {
      this.reset();
      Progress.instances[key] = this;
    }
  }

  public setStatus = this.put.bind(this, this.status);
  public getStatus() {
    return this.get(this.status) || this.defaultStatus;
  }

  public setValue = this.put.bind(this, this.value);
  public getValue = this.get.bind(this, this.value);

  public setMax = this.put.bind(this, this.max);
  public getMax = this.get.bind(this, this.max);

  public setComplete = this.put.bind(this, this.complete);
  public getComplete = this.get.bind(this, this.complete);

  public reset() {
    this.remove(this.complete);
    this.remove(this.status);
    this.put(this.value, 0);
  }

  private static getInstance(key: string): Progress {
    if (!Progress.instances[key]) {
      new Progress(key);
    }
    return Progress.instances[key];
  }

  public static getProgressBarForInstance(key: string): string {
    return Progress.getInstance(key).getProgressBar();
  }

  public getProgressBar(): string {
    return;
    `<progressbar
      class="battis Terse htmlService Element Progress progress"
      value="${this.getValue()}"
      max="${this.getMax()}"
    />
    <div class="battis Terse htmlService Element Progress status">${this.getStatus()}</div>`;
  }
}
