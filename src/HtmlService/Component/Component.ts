import Page from '../Page';
import html from './component.html';

export abstract class Component {
  private _page?: Page;

  public abstract getHtml(config?: Component.Configuration): string;

  public getPage(config?: Component.Configuration): Page {
    if (!this._page) {
      this._page = new Page({ html, data: { body: this.getHtml(config) } });
    }
    return this._page;
  }
}

export namespace Component {
  export type Configuration = Record<string, any>;
}

export default Component;
