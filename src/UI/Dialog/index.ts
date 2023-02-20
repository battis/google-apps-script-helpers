import * as Html from '../../HtmlService';
import html from './index.html';

type Root = { getUi: () => GoogleAppsScript.Base.Ui };
type Button = {
    name: string;
    value?: string;
    class?: string;
};
type HtmlOptions = {
    message: string;
    height?: number;
    buttons?: (Button | string)[];
    functionName: string;
};
type RootlessDialogOptions = HtmlOptions & {
    title: string;
};
type DialogOptions = RootlessDialogOptions & {
    root: Root;
};

function standardizeButton(button: Button | string) {
    if (typeof button == 'string') {
        button = { name: button };
    }
    return { value: button.name, ...button };
}

function show(
    showFunctionName: string,
    { root, title, ...dialog }: DialogOptions
) {
    root.getUi()[showFunctionName](getHtmlOutput(dialog), title);
}

export const showModal = show.bind(null, 'showModalDialog');
export const showModeless = show.bind(null, 'showModelessDialog');

export const dialogClose = () => null;
const CLOSE = 'dialogClose';

export function getHtmlOutput({
    message,
    buttons = [{ name: 'Ok' }],
    height = 100,
    functionName = CLOSE,
}: HtmlOptions) {
    return Html.createTemplate(html, {
        message,
        buttons: buttons.map(standardizeButton),
        functionName,
        id: Utilities.getUuid().replaceAll(/[^a-z0-9]/i, ''),
    }).setHeight(height);
}

export const getHtml = (options: HtmlOptions) =>
    getHtmlOutput(options).getContent();

export function bindTo(root: Root) {
    return class {
        public static showModal = (options: RootlessDialogOptions) =>
            showModal({ ...options, root });
        public static showModeless = (options: RootlessDialogOptions) =>
            showModeless({ ...options, root });
        public static getHtmlOutput = (options: HtmlOptions) =>
            getHtmlOutput(options);
        public static getHtml = (options: HtmlOptions) => getHtml(options);
    };
}
