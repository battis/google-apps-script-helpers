import Job from '../Job';
import View from './View';
import Common from './Common';
import ViewFactory from '../ViewFactory';

export default class Tracker extends Job {
  protected _view?: View;
  protected _viewConstructor: (job: string) => View = (job: string) =>
    new View(job);

  public constructor(job?: string) {
    super(job);
    this.kind = Common.KIND;
  }

  protected get kind() {
    return this.get(Common.KEY_KIND);
  }

  protected set kind(kind) {
    this.put(Common.KEY_KIND, kind);
  }

  protected get view() {
    if (!this._view) {
      this._view = ViewFactory.getInstance(this.job, this.kind);
    }
    return this._view;
  }

  protected set view(view: View) {
    this._view = view;
  }

  protected put(token: string, value: any, update = true): void {
    super.put(token, value);
    if (update) {
      this.view.update(this);
    }
  }

  public set status(status: string) {
    this.put(Common.KEY_STATUS, status);
  }

  public get status() {
    return this.get(Common.KEY_STATUS);
  }

  public set value(value: number) {
    this.put(Common.KEY_VALUE, value);
  }
  public get value() {
    return this.get(Common.KEY_VALUE);
  }

  public set max(max: number) {
    this.put(Common.KEY_MAX, max);
  }
  public get max() {
    return this.get(Common.KEY_MAX);
  }

  public set complete(completion: Common.Completion) {
    this.put(Common.KEY_COMPLETE, completion, false);
  }
  public get complete(): Common.Completion {
    return this.get(Common.KEY_COMPLETE);
  }

  public reset() {
    this.remove(Common.KEY_COMPLETE);
    this.remove(Common.KEY_STATUS);
    this.remove(Common.KEY_VALUE);
    this.remove(Common.KEY_MAX);
    this.view.reset();
  }
}
