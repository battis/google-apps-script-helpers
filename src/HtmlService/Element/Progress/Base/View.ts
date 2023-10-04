import Template from '../../../Template';
import dialog from './dialog.html';
import content from './content.html';
import Job from '../Job';
import * as UI from '../../../../UI';
import ITracker from '../Tracker';
import IView from '../View';
import Key from '../Key';

export type Parameters = { job: string };

export default class View extends Job implements IView {
  public static readonly DEFAULT_HEIGHT = 100;

  private _template = content;
  private _data = () => {
    return {};
  };

  public get kind() {
    return this.get(Key.Kind);
  }

  public constructor(job: string) {
    super(job);
  }

  protected get template() {
    return this._template;
  }

  protected set template(template: string) {
    this._template = template;
  }

  public get data() {
    return this._data;
  }

  protected set data(data: () => { [key: string]: any }) {
    this._data = data;
  }

  public set html(html: string) {
    this.put(Key.Html, html);
  }

  public get html(): string {
    return (
      this.get(Key.Html) ||
      Template.createTemplate(this.template, {}).getContent()
    );
  }

  public get complete() {
    return this.get(Key.Complete);
  }

  public resetComplete() {
    this.put(Key.Complete, null);
  }

  public getContent({ height = View.DEFAULT_HEIGHT, data = {} }) {
    return Template.createTemplate(dialog, {
      job: this.job,
      ...data
    }).setHeight(height);
  }

  public showModalDialog = ({
    root,
    title,
    height = View.DEFAULT_HEIGHT
  }: {
    root: UI.Dialog.Root;
    title: string;
    height?: number;
  }) => {
    root.getUi().showModalDialog(this.getContent({ height }), title);
  };

  public showModelessDialog = ({
    root,
    title,
    height = View.DEFAULT_HEIGHT
  }: {
    root: UI.Dialog.Root;
    title: string;
    height?: number;
  }) => {
    root.getUi().showModelessDialog(this.getContent({ height }), title);
  };

  public update(tracker: ITracker) {
    this.html = Template.createTemplate(this.template, {
      value: tracker.value,
      max: tracker.max,
      status: tracker.status || '',
      ...this.data()
    }).getContent();
  }

  public reset() {
    this.remove(Key.Html);
  }
}
