import {
    getUserCache,
    putUserCache,
    removeUserCache
} from '../../../CacheService';
import { createTemplate } from '../../Template';
import page from './page.html';
import progress from './progress.html';

export type Completion = string | true | { html: string };

function prefix(thread: string, token: string, delimiter = '.') {
    return ['battis', 'Terse', 'HtmlService', 'Progress', thread, token].join(
        delimiter
    );
}

function get(token: string, thread: string) {
    return getUserCache(prefix(thread, token));
}

function put(token: string, thread: string, value: any) {
    return putUserCache(prefix(thread, token), value);
}

// FIXME I don't think "remove" means what you think it means
function remove(token: string, thread: string) {
    return removeUserCache(prefix(thread, token));
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
export const getHtml = (thread: string) =>
    get('html', thread) || createTemplate(progress, {}).getContent();

export function reset(thread: string) {
    remove(thread, 'complete');
    remove(thread, 'status');
    setValue(thread, 0);
}

export const getProgress = (thread: string) => ({
    html: getHtml(thread),
    complete: getComplete(thread),
});

// TODO add indeterminate option
// TODO add timer display/estimate
function update(thread: string) {
    const value = getValue(thread);
    const max = getMax(thread);
    const status = getStatus(thread) || '';
    setHtml(
        thread,
        createTemplate(progress, { value, max, status }).getContent()
    );
}

export const getHtmlOutput = (thread: string) =>
    createTemplate(page, { thread }).setHeight(100);

export type ProgressBinding = {
    reset: () => void;
    getProgress: () => { html: string; complete: string };
    setStatus: (status: string) => void;
    getStatus: () => string;
    setValue: (value: number) => void;
    getValue: () => number;
    incrementValue: () => void;
    decrementValue: () => void;
    setMax: (max: number) => void;
    getMax: () => number;
    setComplete: (completion: Completion) => void;
    getComplete: () => Completion;
    getHtml: () => string;
    getHtmlOutput: () => GoogleAppsScript.HTML.HtmlOutput;
};

export function bindTo(thread: string): ProgressBinding {
    return class {
        public static reset = reset.bind(null, thread);
        public static getProgress = getProgress.bind(null, thread);
        public static setStatus = setStatus.bind(null, thread);
        public static getStatus = getStatus.bind(null, thread);
        public static setValue = setValue.bind(null, thread);
        public static getValue = getValue.bind(null, thread);
        public static incrementValue = incrementValue.bind(null, thread);
        public static decrementValue = decrementValue.bind(null, thread);
        public static setMax = setMax.bind(null, thread);
        public static getMax = getMax.bind(null, thread);
        public static incrementMax = incrementMax.bind(null, thread);
        public static decrementMax = decrementMax.bind(null, thread);
        public static setComplete = setComplete.bind(null, thread);
        public static getComplete = getComplete.bind(null, thread);
        public static getHtml = getHtml.bind(null, thread);
        public static getHtmlOutput = getHtmlOutput.bind(null, thread);
    };
}
