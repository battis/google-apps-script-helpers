import * as UI from '../../../UI';
import Tracker from './Tracker';
import Job from './Job';
import templates from './templates';
import Template from '../../Template';

class View extends Job {
  public static readonly DEFAULT_HEIGHT = 100;

  protected KEY = Object.assign(this.KEY, {
    ...super.KEY,
    HTML: 'html'
  });

  private get html() {
    return templates.base({ ...this.tracker.data, ...this.data }).getContent();
  }

  public get data() {
    return {};
  }

  private _tracker?: Tracker;

  public get tracker() {
    if (!this._tracker) {
      this._tracker = new Tracker({ job: this.job });
    }
    return this._tracker;
  }

  public get progress() {
    Logger.log(JSON.stringify(this.KEY));
    const progress = {
      job: this.job,
      [this.KEY.HTML]: this.html,
      [this.KEY.COMPLETE]: this.complete
    };
    if (this.complete) {
      this.reset();
    }
    return progress;
  }

  public constructor({ job, tracker }: View.Params.Constructor) {
    super(job);
    this._tracker = tracker;
  }

  public show = {
    Popup: (params: View.Params.Popup) => {
      return templates
        .popup({
          ...this.tracker.data,
          ...this.data,
          ...params.data,
          title: params.title,
          message: params.message
        })
        .setTitle(params.title);
    },
    Modal: (params: View.Params.Overlay) => {
      params.root.getUi().showModalDialog(
        templates
          .overlay({
            ...this.tracker.data,
            ...this.data,
            ...params.data
          })
          .setHeight(params.height),
        params.title
      );
    },
    Modeless: (params: View.Params.Overlay) => {
      params.root.getUi().showModelessDialog(
        templates
          .overlay({
            ...this.tracker.data,
            ...this.data,
            ...params.data
          })
          .setHeight(params.height),
        params.title
      );
    }
  };

  public reset(resetTracker = true) {
    super.reset();
    for (const key in this.KEY) {
      this.remove(key);
    }
    if (resetTracker) {
      this.tracker.reset(false);
    }
  }
}

namespace View {
  export namespace Params {
    export type Constructor = {
      job: string;
      tracker?: Tracker;
    };

    export type Popup = {
      title?: string;
      message?: string;
      data?: Template.Data;
    };

    export type Overlay = Popup & {
      root: UI.Dialog.Root;
      height?: number;
    };
  }
}

export { View as default };
