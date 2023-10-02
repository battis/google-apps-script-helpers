import Template from '../../../Template';
import dialog from './dialog.html';
import content from './content.html';
import Common from './Common';
import Job from '../Job';
import * as UI from '../../../../UI';
import Tracker from './Tracker';

export type Parameters = { job: string };

export default class View extends Job {
  public static readonly DEFAULT_HEIGHT = 100;

  private _template = content;
  private _data = () => {
    return {};
  };

  public constructor(job: string) {
    super(job);
  }

  protected get template() {
    return this._template;
  }

  protected set template(template: string) {
    this._template = template;
  }

  protected get data() {
    return this._data;
  }

  protected set data(data: () => { [key: string]: any }) {
    this._data = data;
  }

  public set html(html: string) {
    this.put(Common.KEY_HTML, html);
  }

  public get html(): string {
    return (
      this.get(Common.KEY_HTML) ||
      Template.createTemplate(this.template, {}).getContent()
    );
  }

  public get complete() {
    return this.get(Common.KEY_COMPLETE);
  }

  public resetComplete() {
    this.put(Common.KEY_COMPLETE, null);
  }

  public getHtmlOutput({ height = View.DEFAULT_HEIGHT }) {
    return Template.createTemplate(dialog, {
      job: this.job
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
    root.getUi().showModalDialog(this.getHtmlOutput({ height }), title);
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
    root.getUi().showModelessDialog(this.getHtmlOutput({ height }), title);
  };

  public update(tracker: Tracker) {
    this.html = Template.createTemplate(this.template, {
      value: tracker.value,
      max: tracker.max,
      status: tracker.status || '',
      ...this.data()
    }).getContent();
  }

  public reset() {
    this.remove(Common.KEY_HTML);
  }
}
