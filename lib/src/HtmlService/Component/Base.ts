import * as Template from '../Template';

export abstract class Base {
  protected children: Base.Child[] = [];
  protected data: Template.Data = {};

  public constructor(config: Base.Configuration = {}) {
    if (config.children) {
      this.children = Array.isArray(config.children)
        ? config.children
        : [config.children];
    }
    if (config.data) {
      this.data = config.data;
    }
  }

  public abstract getHtmlOutput(
    data?: Template.Data
  ): GoogleAppsScript.HTML.HtmlOutput;

  protected getChildren(data: Template.Data = {}): string {
    return this.children.reduce((html: string, child) => {
      if (child instanceof Base) {
        return html + child.getHtmlOutput(data).getContent();
      } else if (typeof child === 'string') {
        return html + child;
      } else {
        return html + child.getContent();
      }
    }, '');
  }

  public getCss(data: Template.Data = {}): string {
    return this.children.reduce((css: string, child) => {
      if (child instanceof Base) {
        return css + child.getCss(data);
      }
      return css;
    }, '');
  }

  public getJs(data: Template.Data = {}): string {
    return this.children.reduce((js: string, child) => {
      if (child instanceof Base) {
        return js + child.getJs(data);
      }
      return js;
    }, '');
  }
}

export namespace Base {
  export type Configuration = Template.Data & {
    data?: Template.Data;
    children?: Child | Child[];
  };

  export type Child = Base | GoogleAppsScript.HTML.HtmlOutput | string;
}

export default Base;
