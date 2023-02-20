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
type DialogOptions = HtmlOptions & {
    root: Root;
    title: string;
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

export function getHtmlOutput({
    message,
    buttons = [{ name: 'Ok' }],
    height = 100,
    functionName = null,
}: HtmlOptions) {
    return Html.createTemplate(html, {
        message,
        buttons: buttons.map(standardizeButton),
        functionName,
    }).setHeight(height);
}

export const getHtml = (options: DialogOptions) =>
    getHtmlOutput(options).getContent();

export const close = () => null;
