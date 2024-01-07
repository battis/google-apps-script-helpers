export abstract class Base {
  public abstract getHtml(
    config?: Base.Configuration
  ): GoogleAppsScript.HTML.HtmlOutput;

  public getCss(config: Base.Configuration = {}) {
    return '';
  }

  public getJs(config: Base.Configuration = {}) {
    return '';
  }
}

export namespace Base {
  export type Configuration = Record<string, any>;
}

export default Base;
