import * as UI from '../../../UI';
import * as Template from '../../Template';
import page from './page.html';

export type Option = { name: string; value: string };
export type OptionsCallback = () => Option[];
export type PickerCallback = (value: string, ...args: any[]) => void;
export type Configuration = {
  message?: string;
  list: string;
  actionName?: string;
  callback: string;
  confirmation?: string;
  confirm?: string;
};
type Arguments = Omit<Configuration, 'list' | 'callback'> & {
  list: string;
  callback: string;
};

export const DEFAULT_HEIGHT = 100;

export function getHtmlOutput(config: Configuration) {
  const args: Arguments = {
    message: 'Select one option',
    actionName: 'Select',
    confirm: config.actionName || 'Confirm',
    confirmation: '',
    ...config
  };
  return Template.createTemplate(page, {
    thread: Utilities.getUuid(),
    picker: args
  });
}

export const getHtml = (config: Configuration) =>
  getHtmlOutput(config).getContent();

export function showModalDialog(
  root: UI.Dialog.Root,
  config: Configuration,
  title: string,
  height = DEFAULT_HEIGHT
) {
  root.getUi().showModalDialog(getHtmlOutput(config).setHeight(height), title);
}

export function showModelessDialog(
  root: UI.Dialog.Root,
  config: Configuration,
  title: string,
  height = DEFAULT_HEIGHT
) {
  root
    .getUi()
    .showModelessDialog(getHtmlOutput(config).setHeight(height), title);
}
