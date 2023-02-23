import * as Html from '../../HtmlService';
import content from './content.html';
import page from './page.html';

type Root = { getUi: () => GoogleAppsScript.Base.Ui };
export type Button = {
    name: string;
    value?: string;
    class?: string;
};
type BaseHtmlOptions = {
    message: string;
    height?: number;
    buttons?: (Button | string)[];
};
type HtmlOptionsWithBackEndCallback = BaseHtmlOptions & {
    functionName?: string;
    handler?: never;
    script?: true;
};
type HtmlOptionsWithHandler = BaseHtmlOptions & {
    functionName?: never;
    handler?: string;
    script?: true;
};
type HtmlOptionsWithoutScript = BaseHtmlOptions & {
    functionName?: never;
    handler?: never;
    script: false;
};
export type HtmlOptions =
    | HtmlOptionsWithHandler
    | HtmlOptionsWithBackEndCallback
    | HtmlOptionsWithoutScript;
export type RootlessOptions = HtmlOptions & {
    title: string;
};
export type Options = RootlessOptions & {
    root: Root;
};
export type Callback = { functionName: string; args?: any[] };
export type ResponseHandler = (response: string) => string | Callback | void;

function standardizeButton(button: Button | string) {
    if (typeof button == 'string') {
        button = { name: button };
    }
    return { value: button.name, ...button };
}

function show(showFunctionName: string, { root, title, ...dialog }: Options) {
    root
        .getUi()
    [showFunctionName](
        Html.createTemplate(page, { content: getHtml(dialog) }),
        title
    );
}

export const showModal = show.bind(null, 'showModalDialog');
export const showModeless = show.bind(null, 'showModelessDialog');

export const dialogClose = () => null;
const CLOSE = 'dialogClose';
const HANDLER = 'handleSubmit_{{id}}';

export function getHtmlOutput({
    message,
    buttons = [{ name: 'Ok' }],
    height = 100,
    functionName = CLOSE,
    handler = HANDLER,
    script = true,
}: HtmlOptions) {
    const id = Utilities.getUuid().replaceAll(/[^a-z0-9]/gi, '');
    handler = handler.replace('{{id}}', id);
    return Html.createTemplate(content, {
        message,
        buttons: buttons.map(standardizeButton),
        script,
        functionName,
        handler,
        id,
    }).setHeight(height);
}

export const getHtml = (options: HtmlOptions) =>
    getHtmlOutput(options).getContent();

export function bindTo(root: Root) {
    return class {
        public static showModal = (options: RootlessOptions) =>
            showModal({ ...options, root });
        public static showModeless = (options: RootlessOptions) =>
            showModeless({ ...options, root });
        public static getHtmlOutput = (options: HtmlOptions) =>
            getHtmlOutput(options);
        public static getHtml = (options: HtmlOptions) => getHtml(options);
    };
}
