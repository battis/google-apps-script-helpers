import * as gCacheService from '../../../CacheService';
import * as UI from '../../../UI';
import * as Template from '../../Template';
import dialog from './dialog.html';
import progress from './progress.html';

class Progress {
  public static DEFAULT_HEIGHT = 100;

  public get job(): string {
    return this._job;
  }

  public constructor(private _job = Utilities.getUuid()) {
    Progress.instances[this.job] = this;
  }

  private prefix(token: string, delimiter = '.') {
    return ['battis', 'Terse', 'HtmlService', 'Progress', this.job, token].join(
      delimiter
    );
  }

  private get(token: string) {
    return gCacheService.getUserCache(this.prefix(token));
  }

  private put(token: string, value: any, update = true, additionalValues = {}) {
    const result = gCacheService.putUserCache(
      this.prefix(token),
      value,
      undefined,
      30 * 60
    );
    if (update) {
      this.html = Template.createTemplate(this.hookTemplate(), {
        value: this.value,
        max: this.max,
        status: this.status || '',
        ...this.hookTemplateData()
      }).getContent();
    }
    return result;
  }

  private _hookTemplate = () => progress;

  protected get hookTemplate() {
    return this._hookTemplate;
  }

  protected set hookTemplate(template: () => string) {
    this._hookTemplate = template;
  }

  private _hookTemplateData = () => {
    return {};
  };

  protected get hookTemplateData() {
    return this._hookTemplateData;
  }

  protected set hookTemplateData(templateData: () => { [key: string]: any }) {
    this._hookTemplateData = templateData;
  }

  // FIXME I don't think "remove" means what you think it means
  private remove(token: string) {
    return gCacheService.removeUserCache(this.prefix(token));
  }

  public set status(status: string) {
    this.put('status', status);
  }

  public get status() {
    return this.get('status');
  }

  public set value(value: number) {
    this.put('value', value);
  }
  public get value() {
    return this.get('value');
  }

  public set max(max: number) {
    this.put('max', max);
  }
  public get max() {
    return this.get('max');
  }

  public set complete(completion: Progress.Completion) {
    this.put('complete', completion, false);
  }
  public get complete(): Progress.Completion {
    return this.get('complete');
  }

  public set html(html: string) {
    this.put('html', html, false);
  }
  public get html(): string {
    return (
      this.get('html') || Template.createTemplate(progress, {}).getContent()
    );
  }

  public reset() {
    this.remove('complete');
    this.remove('status');
    this.value = 0;
  }

  public static getProgress(job: string) {
    const progress = Progress.getInstance(job);
    const html = progress.html;
    const complete = progress.complete;
    if (complete) {
      progress.remove('html');
      progress.remove('status');
      progress.remove('value');
      progress.remove('max');
      progress.remove('complete');
    }
    return {
      html,
      complete
    };
  }

  public getHtmlOutput = (height = Progress.DEFAULT_HEIGHT) =>
    Template.createTemplate(dialog, { job: this.job }).setHeight(height);

  public showModalDialog = (
    root: UI.Dialog.Root,
    title: string,
    height = Progress.DEFAULT_HEIGHT
  ) => {
    root.getUi().showModalDialog(this.getHtmlOutput(height), title);
  };

  public showModelessDialog = (
    root: UI.Dialog.Root,
    title: string,
    height = Progress.DEFAULT_HEIGHT
  ) => {
    root.getUi().showModelessDialog(this.getHtmlOutput(height), title);
  };

  private static instances: { [job: string]: Progress } = {};
  private static getInstance(job: string) {
    return this.instances[job] || new Progress(job);
  }
  /** @deprecated use Progress instance */
  public static getStatus(job: string) {
    return this.getInstance(job).status;
  }
  /** @deprecated use Progress instance */
  public static setStatus(job: string, status: string) {
    this.getInstance(job).status = status;
  }
  /** @deprecated use Progress instance */
  public static getValue(job: string) {
    return this.getInstance(job).value;
  }
  /** @deprecated use Progress instance */
  public static setValue(job: string, value: number) {
    this.getInstance(job).value = value;
  }
  /** @deprecated use Progress instance */
  public static incrementValue(job: string, increment = 1) {
    this.getInstance(job).value += increment;
  }
  /** @deprecated use Progress instance */
  public static decrementValue(job: string, decrement = 1) {
    this.getInstance(job).value -= decrement;
  }
  /** @deprecated use Progress instance */
  public static getMax(job: string) {
    return this.getInstance(job).max;
  }
  /** @deprecated use Progress instance */
  public static setMax(job: string, max: number) {
    this.getInstance(job).max = max;
  }
  /** @deprecated use Progress instance */
  public static incrementMax(job: string, increment = 1) {
    this.getInstance(job).max += increment;
  }
  /** @deprecated use Progress instance */
  public static decrementMax(job: string, decrement = 1) {
    this.getInstance(job).max -= decrement;
  }
  /** @deprecated use Progress instance */
  public static getComplete(job: string) {
    return this.getInstance(job).complete;
  }
  /** @deprecated use Progress instance */
  public static setComplete(job: string, completion: Progress.Completion) {
    this.getInstance(job).complete = completion;
  }
  /** @deprecated use Progress instance */
  public static getHtml(job: string) {
    return this.getInstance(job).html;
  }
  /** @deprecated use Progress instance */
  public static setHtml(job: string, html: string) {
    this.getInstance(job).html = html;
  }
  /** @deprecated use Progress instance */
  public static reset(job: string) {
    this.getInstance(job).reset();
  }
  /** @deprecated use Progress instance */
  public static getHtmlOutput(job: string, height = Progress.DEFAULT_HEIGHT) {
    return this.getInstance(job).getHtmlOutput(height);
  }
  /** @deprecated use Progress instance */
  public static showModalDialog(
    root: UI.Dialog.Root,
    job: string,
    title: string,
    height = Progress.DEFAULT_HEIGHT
  ) {
    this.getInstance(job).showModalDialog(root, title, height);
  }
  /** @deprecated use Progress instance */
  public static showModelessDialog(
    root: UI.Dialog.Root,
    job: string,
    title: string,
    height = Progress.DEFAULT_HEIGHT
  ) {
    this.getInstance(job).showModelessDialog(root, title, height);
  }
  /** @deprecated use Progress instance */
  public static bindTo = (job: string) =>
    new (class implements Progress.Binding {
      getThread = () => job;
      reset = Progress.reset.bind(Progress, job);
      getProgress = Progress.getProgress.bind(Progress, job);
      setStatus = Progress.setStatus.bind(Progress, job);
      getStatus = Progress.getStatus.bind(Progress, job);
      setValue = Progress.setValue.bind(Progress, job);
      getValue = Progress.getValue.bind(Progress, job);
      incrementValue = Progress.incrementValue.bind(Progress, job);
      decrementValue = Progress.decrementValue.bind(Progress, job);
      setMax = Progress.setMax.bind(Progress, job);
      getMax = Progress.getMax.bind(Progress, job);
      incrementMax = Progress.incrementMax.bind(Progress, job);
      decrementMax = Progress.decrementMax.bind(Progress, job);
      setComplete = Progress.setComplete.bind(Progress, job);
      getComplete = Progress.getComplete.bind(Progress, job);
      getHtml = Progress.getHtml.bind(Progress, job);
      setHtml = Progress.setHtml.bind(Progress, job);
      getHtmlOutput = Progress.getHtmlOutput.bind(Progress, job);
      showModalDialog = (
        root: UI.Dialog.Root,
        title: string,
        height = Progress.DEFAULT_HEIGHT
      ) => Progress.showModalDialog(root, job, title, height);
      showModelessDialog = (
        root: UI.Dialog.Root,
        title: string,
        height = Progress.DEFAULT_HEIGHT
      ) => Progress.showModelessDialog(root, job, title, height);
    })();
}

namespace Progress {
  export type Completion =
    | string
    | true
    | { html: string }
    | { [key: string]: any };
  /** @deprecated use Progress instance */
  export type Binding = { getThread: () => string } & {
    [k in keyof Omit<
      typeof Progress,
      'prototype' | 'DEFAULT_HEIGHT' | 'bindTo'
    >]: Function; // eslint-disable-line @typescript-eslint/ban-types
  };
}

export { Progress as default };
