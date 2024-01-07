import * as UI from '../../UI';
import ConcatenateIfDefined from '../../shared/ConcatenateDefined';
import Base from '../Component/Base';
import * as Template from '../Template';
import MMessage from './Message';
import page from './page.html';
import pageCss from './page.scss';
import { MethodNamesMatching } from '@battis/typescript-tricks';

export class Page {
  private html: string;
  private css?: string;
  private js?: string;
  private data?: Template.Data;

  public static from(source: Page.Snippet | Page.Snippet[]) {
    function toPageConfig(
      arg: Base | GoogleAppsScript.HTML.HtmlOutput | string
    ): Page.Configuration.Constructor {
      if (arg instanceof Base) {
        return {
          html: arg.getHtml().getContent(),
          css: arg.getCss(),
          js: arg.getJs()
        };
      } else if (typeof arg === 'string') {
        return { html: HtmlService.createHtmlOutput(arg).getContent() };
      } else {
        return { html: arg.getContent() };
      }
    }

    if (Array.isArray(source)) {
      return new Page(
        source
          .map((s) => toPageConfig(s))
          .reduce(
            (pageConfig, config) => ({
              html: ConcatenateIfDefined(pageConfig.html, config.html),
              css: ConcatenateIfDefined(pageConfig.css, config.css),
              js: ConcatenateIfDefined(pageConfig.js, config.js)
            }),
            {}
          )
      );
    } else {
      return new Page(toPageConfig(source));
    }
  }

  public constructor({
    html = '',
    css,
    js,
    data = {}
  }: Page.Configuration.Constructor) {
    this.html = html;
    this.css = ConcatenateIfDefined(pageCss, css);
    this.js = js;
    this.data = data;
  }

  private build({
    mode,
    title,
    data = {},
    vars = {}
  }: Page.Configuration.Build) {
    const _data = { title, mode, ...this.data, ...data };
    return Template.create(page, _data, {
      ...vars,
      html: Template.create(this.html, _data).getContent(),
      css: this.css,
      js: this.js,
      mode
    }).setTitle(title);
  }

  public popup(config: Page.Configuration.Popup) {
    return this.build({ ...config, mode: Page.Mode.popup });
  }

  private overlay(
    mode: Page.Mode,
    show: MethodNamesMatching<
      GoogleAppsScript.Base.Ui,
      (userInterface: GoogleAppsScript.HTML.HtmlOutput, title: string) => void
    >,
    { root, height, ...config }: Page.Configuration.Overlay
  ) {
    const overlay = this.build({ ...config, mode });
    root.getUi()[show](overlay.setHeight(height), config.title);
  }
  public modal = this.overlay.bind(this, Page.Mode.overlay, 'showModalDialog');
  public modeless = this.overlay.bind(
    this,
    Page.Mode.overlay,
    'showModelessDialog'
  );
}

export namespace Page {
  export type Snippet = Base | GoogleAppsScript.HTML.HtmlOutput | string;

  export namespace Configuration {
    export type Constructor = {
      html?: string;
      css?: string;
      js?: string;
      data?: Template.Data;
    };

    export type Build = {
      mode: Mode;
      title: string;
      data?: Template.Data;
      vars?: Template.Data;
    };

    export type Popup = Omit<Build, 'mode'>;

    export type Overlay = Popup & {
      root: UI.Dialog.Root;
      height?: number;
    };
  }

  export import Message = MMessage;

  export enum Mode {
    overlay,
    popup
  }
}

export default Page;
