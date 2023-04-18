import * as CacheService from '../../../CacheService';
import * as UI from '../../../UI';
import * as Template from '../../Template';
import page from './page.html';
import progress from './progress.html';

export type Completion = string | true | { html: string };

export const DEFAULT_HEIGHT = 100;

function prefix(thread: string, token: string, delimiter = '.') {
  return ['battis', 'Terse', 'HtmlService', 'Progress', thread, token].join(
    delimiter
  );
}

function get(token: string, thread: string) {
  return CacheService.getUserCache(prefix(thread, token));
}

function put(token: string, thread: string, value: any) {
  return CacheService.putUserCache(prefix(thread, token), value);
}

// FIXME I don't think "remove" means what you think it means
function remove(token: string, thread: string) {
  return CacheService.removeUserCache(prefix(thread, token));
}

function putAndUpdate(token: string, thread: string, value: any) {
  put(token, thread, value);
  update(thread);
}

export const setStatus = (thread: string, status: string) =>
  putAndUpdate('status', thread, status);
export const getStatus = (thread: string) => get('status', thread);

export const setValue = (thread: string, value: number) =>
  putAndUpdate('value', thread, value);
export const getValue = (thread: string) => get('value', thread);
export const incrementValue = (thread: string, increment = 1) =>
  setValue(thread, getValue(thread) + increment);
export const decrementValue = (thread: string, decrement = 1) =>
  setValue(thread, getValue(thread) - decrement);

export const setMax = (thread: string, max: number) =>
  putAndUpdate('max', thread, max);
export const getMax = (thread: string) => get('max', thread);
export const incrementMax = (thread: string, increment = 1) =>
  setMax(thread, getMax(thread) + increment);
export const decrementMax = (thread: string, decrement = 1) =>
  setMax(thread, getMax(thread) - decrement);

export const setComplete = (thread: string, completion: Completion) =>
  put('complete', thread, completion);
export const getComplete = (thread: string) => get('complete', thread);

export const setHtml = (thread: string, html: string) =>
  put('html', thread, html);
export const getHtml = (thread: string): string =>
  get('html', thread) || Template.createTemplate(progress, {}).getContent();

export function reset(thread: string) {
  remove(thread, 'complete');
  remove(thread, 'status');
  setValue(thread, 0);
}

export const getProgress = (thread: string) => ({
  html: getHtml(thread),
  complete: getComplete(thread)
});

// TODO add indeterminate option
// TODO add timer display/estimate
function update(thread: string) {
  const value = getValue(thread);
  const max = getMax(thread);
  const status = getStatus(thread) || '';
  setHtml(
    thread,
    Template.createTemplate(progress, { value, max, status }).getContent()
  );
}

export const getHtmlOutput = (thread: string, height = DEFAULT_HEIGHT) =>
  Template.createTemplate(page, { thread }).setHeight(height);

export const showModalDialog = (
  root: UI.Dialog.Root,
  thread: string,
  title: string,
  height = DEFAULT_HEIGHT
) => {
  root.getUi().showModalDialog(getHtmlOutput(thread, height), title);
};

export const showModelessDialog = (
  root: UI.Dialog.Root,
  thread: string,
  title: string,
  height = DEFAULT_HEIGHT
) => {
  root.getUi().showModelessDialog(getHtmlOutput(thread, height), title);
};

export const bindTo = (thread: string) =>
  new (class ProgressBinding {
    getThread = () => thread;
    reset = reset.bind(null, thread);
    getProgress = getProgress.bind(null, thread);
    setStatus = setStatus.bind(null, thread);
    getStatus = getStatus.bind(null, thread);
    setValue = setValue.bind(null, thread);
    getValue = getValue.bind(null, thread);
    incrementValue = incrementValue.bind(null, thread);
    decrementValue = decrementValue.bind(null, thread);
    setMax = setMax.bind(null, thread);
    getMax = getMax.bind(null, thread);
    incrementMax = incrementMax.bind(null, thread);
    decrementMax = decrementMax.bind(null, thread);
    setComplete = setComplete.bind(null, thread);
    getComplete = getComplete.bind(null, thread);
    getHtml = getHtml.bind(null, thread);
    getHtmlOutput = getHtmlOutput.bind(null, thread);
    showModalDialog = (
      root: UI.Dialog.Root,
      title: string,
      height = DEFAULT_HEIGHT
    ) => showModalDialog(root, thread, title, height);
    showModelessDialog = (
      root: UI.Dialog.Root,
      title: string,
      height = DEFAULT_HEIGHT
    ) => showModelessDialog(root, thread, title, height);
  })();
