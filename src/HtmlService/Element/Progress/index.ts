import * as MCacheService from '../../../CacheService';
import * as UI from '../../../UI';
import * as Template from '../../Template';
import page from './page.html';
import MPaged from './Paged';
import progress from './progress.html';

export const DEFAULT_HEIGHT = 100;

class Progress {
  protected constructor() { } // eslint-disable-line @typescript-eslint/no-empty-function

  public static DEFAULT_HEIGHT = 100;

  private static prefix(thread: string, token: string, delimiter = '.') {
    return ['battis', 'Terse', 'HtmlService', 'Progress', thread, token].join(
      delimiter
    );
  }

  private static get(token: string, thread: string) {
    return MCacheService.getUserCache(this.prefix(thread, token));
  }

  private static put(token: string, thread: string, value: any) {
    return MCacheService.putUserCache(
      this.prefix(thread, token),
      value,
      undefined,
      30 * 60
    );
  }

  // FIXME I don't think "remove" means what you think it means
  private static remove(token: string, thread: string) {
    return MCacheService.removeUserCache(this.prefix(thread, token));
  }

  private static putAndUpdate(token: string, thread: string, value: any) {
    this.put(token, thread, value);
    this.update(thread);
  }

  public static setStatus = (thread: string, status: string) =>
    this.putAndUpdate('status', thread, status);
  public static getStatus = (thread: string) => this.get('status', thread);

  public static setValue = (thread: string, value: number) =>
    this.putAndUpdate('value', thread, value);
  public static getValue = (thread: string) => this.get('value', thread);
  public static incrementValue = (thread: string, increment = 1) =>
    this.setValue(thread, this.getValue(thread) + increment);
  public static decrementValue = (thread: string, decrement = 1) =>
    this.setValue(thread, this.getValue(thread) - decrement);

  public static setMax = (thread: string, max: number) =>
    this.putAndUpdate('max', thread, max);
  public static getMax = (thread: string) => this.get('max', thread);
  public static incrementMax = (thread: string, increment = 1) =>
    this.setMax(thread, this.getMax(thread) + increment);
  public static decrementMax = (thread: string, decrement = 1) =>
    this.setMax(thread, this.getMax(thread) - decrement);

  public static setComplete = (
    thread: string,
    completion: Progress.Completion
  ) => this.put('complete', thread, completion);
  public static getComplete = (thread: string): Progress.Completion =>
    this.get('complete', thread);
  private static setIncomplete = (thread: string) =>
    this.put('complete', thread, false);

  public static setHtml = (thread: string, html: string) =>
    this.put('html', thread, html);
  public static getHtml = (thread: string): string =>
    this.get('html', thread) ||
    Template.createTemplate(progress, {}).getContent();

  public static reset(thread: string) {
    this.remove(thread, 'complete');
    this.remove(thread, 'status');
    this.setValue(thread, 0);
  }

  public static getProgress(thread: string) {
    const html = this.getHtml(thread);
    const complete = this.getComplete(thread);
    if (complete) {
      if (typeof complete === 'object' && 'callback' in complete) {
        this.setIncomplete(thread);
      } else {
        this.remove('html', thread);
        this.remove('status', thread);
        this.remove('value', thread);
        this.remove('max', thread);
        this.remove('complete', thread);
      }
    }
    return {
      html,
      complete
    };
  }

  // TODO add indeterminate option
  // TODO add timer display/estimate
  private static update(thread: string) {
    const value = this.getValue(thread);
    const max = this.getMax(thread);
    const status = this.getStatus(thread) || '';
    this.setHtml(
      thread,
      Template.createTemplate(progress, { value, max, status }).getContent()
    );
  }

  public static getHtmlOutput = (thread: string, height = DEFAULT_HEIGHT) =>
    Template.createTemplate(page, { thread }).setHeight(height);

  public static showModalDialog = (
    root: UI.Dialog.Root,
    thread: string,
    title: string,
    height = DEFAULT_HEIGHT
  ) => {
    root.getUi().showModalDialog(this.getHtmlOutput(thread, height), title);
  };

  public static showModelessDialog = (
    root: UI.Dialog.Root,
    thread: string,
    title: string,
    height = DEFAULT_HEIGHT
  ) => {
    root.getUi().showModelessDialog(this.getHtmlOutput(thread, height), title);
  };

  public static bindTo = (thread: string) =>
    new (class implements Progress.Binding {
      getThread = () => thread;
      reset = Progress.reset.bind(Progress, thread);
      getProgress = Progress.getProgress.bind(Progress, thread);
      setStatus = Progress.setStatus.bind(Progress, thread);
      getStatus = Progress.getStatus.bind(Progress, thread);
      setValue = Progress.setValue.bind(Progress, thread);
      getValue = Progress.getValue.bind(Progress, thread);
      incrementValue = Progress.incrementValue.bind(Progress, thread);
      decrementValue = Progress.decrementValue.bind(Progress, thread);
      setMax = Progress.setMax.bind(Progress, thread);
      getMax = Progress.getMax.bind(Progress, thread);
      incrementMax = Progress.incrementMax.bind(Progress, thread);
      decrementMax = Progress.decrementMax.bind(Progress, thread);
      setComplete = Progress.setComplete.bind(Progress, thread);
      getComplete = Progress.getComplete.bind(Progress, thread);
      getHtml = Progress.getHtml.bind(Progress, thread);
      setHtml = Progress.setHtml.bind(Progress, thread);
      getHtmlOutput = Progress.getHtmlOutput.bind(Progress, thread);
      showModalDialog = (
        root: UI.Dialog.Root,
        title: string,
        height = DEFAULT_HEIGHT
      ) => Progress.showModalDialog(root, thread, title, height);
      showModelessDialog = (
        root: UI.Dialog.Root,
        title: string,
        height = DEFAULT_HEIGHT
      ) => Progress.showModelessDialog(root, thread, title, height);
    })();
}

namespace Progress {
  export type Completion =
    | string
    | true
    | { html: string }
    | { callback: string; step: number; args?: any[] };
  export type Binding = { getThread: () => string } & {
    [k in keyof Omit<
      typeof Progress,
      'prototype' | 'DEFAULT_HEIGHT' | 'bindTo' | 'Paged'
    >]: Function; // eslint-disable-line @typescript-eslint/ban-types
  };
  export import Paged = MPaged;
}

export { Progress as default };
