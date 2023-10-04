import content from './content.html';
import Base from '../Base';
import Key from './Key';

export default class View extends Base.View {
  public constructor(job: string) {
    super(job);
    this.template = content;
    this.data = () => {
      return {
        endTime: this.get(Key.EndTime)
      };
    };
  }
}
