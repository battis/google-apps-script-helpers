import PagedTracker from '../Paged/Tracker';
import Common from './Common';

export default class Tracker extends PagedTracker {
  public constructor(params) {
    super(params);
    this.kind = Common.KIND;
  }
}
