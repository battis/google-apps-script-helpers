import Component from '../Component';
import * as Callback from '../../../shared/Callback';
import * as Template from '../../Template';
import Page from '../../Page';
import picker from './picker.html';
import css from './picker.scss';

export class Picker implements Component {
  public constructor(private config: Picker.Configuration) {}

  private _html?: string;

  public getHtml(): string {
    if (!this._html) {
      this._html = Template.create(picker, {
        ...this.config,
        ...Callback.standardize({
          callback: this.config.options,
          functionKey: 'options',
          argsKey: 'optionsArgs'
        }),
        ...Callback.standardize({
          callback: this.config.callback,
          argsKey: 'callbackArgs'
        })
      }).getContent();
    }
    return this._html;
  }

  private _page?: Page;

  public getPage(): Page {
    if (!this._page) {
      this._page = new Page({ html: this.getHtml() });
    }
    return this._page;
  }
}

export namespace Picker {
  export type Configuration = {
    message?: string;
    options: Callback.Function;
    actionName?: string;
    callback: Callback.Function;
  };

  export type Options = {
    name?: string;
    value: string | number;
    selected?: boolean;
  }[];
}

export default Picker;
