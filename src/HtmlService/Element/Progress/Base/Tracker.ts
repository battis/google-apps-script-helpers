import Job from '../Job';
import View from './View';
import ITracker from '../Tracker';
import ProgressFactory from '../ProgressFactory';
import Key from '../Key';
import Kind from './Kind';

export default class Tracker extends Job implements ITracker {
  protected _view?: View;
  protected _viewConstructor: (job: string) => View = (job: string) =>
    new View(job);

  public constructor(job?: string) {
    super(job);
    //this.kind = Kind;
  }

  public get kind() {
    return this.get(Key.Kind);
  }

  protected set kind(kind) {
    this.put(Key.Kind, kind);
  }

  public get view() {
    if (!this._view) {
      this._view = ProgressFactory.getViewInstance(this.job) as View;
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
    this.put(Key.Status, status);
  }

  public get status() {
    return this.get(Key.Status);
  }

  public set value(value: number) {
    this.put(Key.Value, value);
  }
  public get value() {
    return this.get(Key.Value);
  }

  public set max(max: number) {
    this.put(Key.Max, max);
  }
  public get max() {
    return this.get(Key.Max);
  }

  public set complete(completion) {
    this.put(Key.Complete, completion, false);
  }
  public get complete() {
    return this.get(Key.Complete);
  }

  public reset() {
    this.remove(Key.Complete);
    this.remove(Key.Status);
    this.remove(Key.Value);
    this.remove(Key.Max);
    this.view.reset();
  }
}
