import Tracker from './Tracker';
import Job from './Job';
import templates from './templates';
import Template from '../../Template';
import lib from '../../../../../js/HtmlService/Component/Progress.js.html';
import Base from '../Base';

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

  protected getLib(data: Template.Data) {
    return Template.create(lib, data).getContent();
  }

  public popup(data: View.Params.Popup) {
    return super.popup({
      ...data,
      script: 'g.HtmlService.Component.Progress.Init.popup();'
    });
  }

  public modal(data: View.Params.Overlay) {
    return super.modal({
      ...data,
      script: 'g.HtmlService.Component.Progress.Init.overlay();'
    });
  }

  public modeless(data: View.Params.Overlay) {
    return super.modeless({
      ...data,
      script: 'g.HtmlService.Component.Progress.Init.overlay();'
    });
  }

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
  type Configuration = {
    title?: string;
    message?: string;
  };

  export namespace Params {
    export type Constructor = {
      job: string;
      tracker?: Tracker;
    };

    export type Popup = Base.Params.Popup & Configuration;

    export type Overlay = Base.Params.Overlay & Configuration;
  }
}

export { View as default };
