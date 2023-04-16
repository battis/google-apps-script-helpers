import HtmlService from './HtmlService';
import UI from './UI';

// FIXME won't work without improvements in gas-webpack-plugin
// TODO some sort of fancy filtering
export function register() {
  global.include = HtmlService.include;
  global.getProgress = HtmlService.Element.Progress.getProgress;
  global.dialogClose = UI.Dialog.dialogClose;
}
