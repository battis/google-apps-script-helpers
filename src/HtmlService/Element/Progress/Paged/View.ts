import content from './content.html';
import BaseView from '../Base/View';
import Common from './Common';

export default class View extends BaseView {
  public constructor(job: string) {
    super(job);
    this.template = content;
    this.data = this.endTime;
  }

  public endTime() {
    return { endTime: this.get(Common.KEY_END_TIME) };
  }
}
