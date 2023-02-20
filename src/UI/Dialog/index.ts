import * as Html from '../../HtmlService';
import html from './index.html';

type Root = { getUi: () => GoogleAppsScript.Base.Ui };
type Button = {
    name: string;
    value?: string;
    class?: string;
};
type Options = {
    root: Root;
    message: string;
    title: string;
    height?: number;
    buttons?: (Button | string)[];
    functionName: string;
};

function standardizeButton(button: Button | string) {
    if (typeof button == 'string') {
        button = { name: button };
    }
    return { value: button.name, ...button };
}

function show(
    show: string,
    {
        root,
        message,
        title,
        buttons = [{ name: 'Ok' }],
        height = 100,
        functionName = null,
    }: Options
) {
    root.getUi()[show](
        Html.createTemplate(html, {
            message,
            buttons: buttons.map(standardizeButton),
            functionName,
        }).setHeight(height),
        title
    );
}

export const showModal = show.bind(null, 'showModal');
export const showModeless = show.bind(null, 'showModeless');

export const close = () => null;
