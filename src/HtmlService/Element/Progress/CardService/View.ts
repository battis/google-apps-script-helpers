import content from './content.html';
import Paged from '../Paged';
import Template from '../../../Template';
import dialog from './dialog.html';

class View extends Paged.View {
  public constructor(job: string) {
    super(job);
    this.template = content;
  }

  public getContent({
    title,
    message = '<p>Do not close this window until the progress bar is complete.</p>',
    height = View.DEFAULT_HEIGHT,
    data = {}
  }: View.Parameters.getContent) {
    return Template.createTemplate(dialog, {
      job: this.job,
      title,
      message,
      ...data
    }).setHeight(height);
  }
}

namespace View {
  export namespace Parameters {
    export type getContent =
      /* Parameters<InstanceType<typeof Paged.View>['getContent']> & */ {
        title: string;
        message?: string;
        height?: number;
        data: Record<string, any>;
      };
  }
}

export { View as default };
