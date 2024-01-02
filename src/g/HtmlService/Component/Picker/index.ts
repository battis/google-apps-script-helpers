import Component from '../Component';
import * as Template from '../../Template';
import Page from '../Page';
import picker from './picker.html';

export class Picker extends Component {
  public getNamespace(): string {
    return 'g.HtmlService.Component.Picker';
  }

  public constructor(private config: Picker.Configuration) {
    super();
  }

  protected _html?: string;

  public getHtml(mode: Page.Mode = 'overlay') {
    if (!this._html) {
      this._html = Template.create(picker).getContent();
    }
    return this._html;
  }

  protected _page: Page;

  public getPage(mode: Page.Mode = 'overlay') {
    if (!this._page) {
      this._page = new Page({ html: this.getHtml(mode) }).register(this);
    }
    return this._page;
  }
}

export namespace Picker {
  export type Option = { name: string; value: string };
  export type OptionsCallback = () => Option[];
  export type PickerCallback = (value: string, ...args: any[]) => void;
  export type Configuration = {
    message?: string;
    list: string;
    actionName?: string;
    callback: string;
    confirmation?: string;
    confirm?: string;
    job?: string;
  };
  export type Arguments = Omit<Configuration, 'list' | 'callback'> & {
    list: string;
    callback: string;
  };

  export interface Pickable {
    toOption(): Option;
  }
}

export { Picker as default };
