import Common from './Common';
import Base from './Base/Common';
import CardService from './CardService/Common';
import Job from './Job';
import Paged from './Paged/Common';
import PagedView from './Paged/View';
import BaseView from './Base/View';
import CardView from './CardService/View';

export default class ViewFactory {
  private static instances: Record<string, BaseView> = {};

  public static getInstance(job: string, kind?: string) {
    let instance = this.instances[job];
    if (!instance) {
      switch (kind || Job.get(job, Common.KEY_KIND)) {
        case Paged.KIND:
          instance = new PagedView(job);
          break;
        case CardService.KIND:
          instance = new CardView(job);
          break;
        case Base.KIND:
        default:
          instance = new BaseView(job);
      }
      this.instances[instance.job] = instance;
    }
    return instance;
  }

  public static getProgress(job: string) {
    try {
      const progress = ViewFactory.getInstance(job);
      const html = progress.html;
      const complete = progress.complete;
      if (complete) {
        progress.resetComplete();
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
