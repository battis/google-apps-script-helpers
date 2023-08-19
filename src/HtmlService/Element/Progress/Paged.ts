import Progress from '.';
import * as UI from '../../../UI';

class Paged<Page = any> {
  /** @see {@link https://developers.google.com/apps-script/guides/services/quotas Quotas for Google Services} */
  private static MAX_SIMULTANEOUS_EXECUTIONS = 30; // scripts
  private static MAX_EXECUTION_LENGTH = 30; // minutes, documented as 6, observed to be 30

  private progress: Progress.Binding;

  public constructor(
    thread: string,
    private modal: Paged.ModalParameters,
    private loader: Paged.DatasetLoader<Page>,
    private handler: Paged.PageHandler<Page>,
    private callback: string | { function: string; args: any[] },
    step = 0,
    private completion: Progress.Completion = true,
    private quotaMargin = 1,
    private pageMargin = 2
  ) {
    this.progress = Progress.bindTo(thread);
    this.run(step);
  }

  private run(step = 0) {
    const end =
      new Date().getTime() +
      (Paged.MAX_EXECUTION_LENGTH - this.quotaMargin) * 60 * 1000;
    if (step == 0) {
      this.progress.showModalDialog(
        this.modal.root,
        this.modal.title,
        this.modal.height
      );
    }
    const dataset = this.loader(step);
    let averagePage: number;
    let counter = 1;
    for (const page of dataset) {
      const pageStart = new Date().getTime();
      this.handler(page);
      if (averagePage) {
        averagePage =
          (averagePage * counter + (new Date().getTime() - pageStart)) /
          (counter + 1);
      } else {
        averagePage = new Date().getTime() - pageStart;
      }
      if (new Date().getTime() + averagePage * this.pageMargin > end) {
        let args = [];
        let callback = this.callback;
        if (typeof this.callback === 'object') {
          args = this.callback.args;
          callback = this.callback.function;
        }
        this.progress.setComplete({
          callback,
          args,
          step: step + counter
        });
        return;
      }
      counter++;
    }
    this.progress.setComplete(this.completion);
  }
}

namespace Paged {
  export type ModalParameters = {
    root: UI.Dialog.Root;
    title: string;
    height?: number;
  };
  export type Dataset<Page> = Iterable<Page>;
  export type DatasetLoader<Page> = (
    start: number,
    end?: number
  ) => Dataset<Page>;
  export type PageHandler<Page> = (page: Page) => void;
}

export { Paged as default };
