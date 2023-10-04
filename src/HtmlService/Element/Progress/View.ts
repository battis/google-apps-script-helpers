import * as UI from '../../../UI';
import Model from './Model';
import Tracker from './Tracker';

interface View extends Model {
  html: string;
  complete: Model.Completion;

  data(): Record<string, any>;
  update(tracker: Tracker): void;
  getContent(params: View.Parameters.Content): GoogleAppsScript.HTML.HtmlOutput;
  showModalDialog(params: View.Parameters.Dialog): void;
  showModelessDialog(prams: View.Parameters.Dialog): void;
  reset(): void;
}

namespace View {
  export namespace Parameters {
    export type Content = {
      title?: string;
      height?: number;
      data?: Record<string, any>;
    };
    export type Dialog = Content & { root: UI.Dialog.Root };
  }
  export type Status = {
    html: string;
    complete?: Model.Completion;
  };
}

export { View as default };
