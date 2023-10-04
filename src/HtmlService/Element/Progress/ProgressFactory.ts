import Base from './Base';
import Paged from './Paged';
import CS from './CardService';
import Tracker from './Tracker';
import View from './View';
import Job from './Job';
import Key from './Key';
import Model from './Model';

class ProgressFactory {
  private static trackers: Record<Model.JobId, Tracker> = {};
  private static views: Record<Model.JobId, View> = {};

  public static getTrackerInstance(
    parameters: ProgressFactory.Parameters.getTrackerInstance = {}
  ): Tracker {
    const {
      job = Utilities.getUuid(),
      loader,
      handler,
      callback,
      CardService,
      ...params
    } = parameters;
    let instance: Tracker = this.trackers[job];
    //if (!instance) {
    if (CardService) {
      instance = new CS.Tracker({
        job,
        loader,
        handler,
        callback,
        CardService,
        ...params
      });
    } else if (loader && handler && callback) {
      instance = new Paged.Tracker({
        job,
        loader,
        handler,
        callback,
        ...params
      });
    } else {
      instance = new Base.Tracker(job);
    }
    this.trackers[job] = instance;
    //}
    return instance;
  }

  public static getViewInstance(job: Model.JobId): View {
    let instance = this.views[job];
    if (!instance) {
      switch (Job.get(job, Key.Kind)) {
        case Paged.Kind:
          instance = new Paged.View(job);
          break;
        case CS.Kind:
          instance = new CS.View(job);
          break;
        case Base.Kind:
        default:
          instance = new Base.View(job);
      }
      this.views[job] = instance;
    }
    return instance;
  }

  public static getProgress(job: string): View.Status {
    try {
      const progress = this.getViewInstance(job);
      const html = progress.html;
      const complete = progress.complete;
      if (complete) {
        progress.reset();
      }
      return {
        html,
        complete
      };
    } catch (e) {
      Logger.log(e);
    }
  }
}

namespace ProgressFactory {
  export namespace Parameters {
    export type getTrackerInstance<Page = any> = {
      job?: Model.JobId;
      loader?: Tracker.Dataset.Loader<Page>;
      handler?: Tracker.Dataset.Handler<Page>;
      callback?: Tracker.Dataset.Callback;
      CardService?: { run: boolean };
    } & Record<string, any>;
  }
}

export { ProgressFactory as default };
