import content from './content.html';
import PagedView from '../Paged/View';
import Template from '../../../Template';
import dialog from './dialog.html';

export default class View extends PagedView {
  public constructor(job: string) {
    super(job);
    this.template = content;
    this.data = this.endTime;
  }

  public getHtmlOutput({
    title,
    message = '<p>Do not close this window until the progress bar is complete.</p>',
    height = View.DEFAULT_HEIGHT,
    data = {}
  }: {
    title: string;
    message?: string;
    height?: number;
    data?: Record<string, any>;
  }) {
    return Template.createTemplate(dialog, {
      job: this.job,
      title,
      message,
      ...data
    }).setHeight(height);
  }
}
