import * as Template from '../Template';
import * as UI from '../../UI';
import page from './page.html';
import scss from './page.scss';
import EOL from '../../shared/EOL';
import MMessage from './Message';

export class Page {
  private html: string;
  private css?: string;
  private js?: string;
  private data?: Template.Data;

  public constructor({
    html = '',
    css,
    js,
    data = {}
  }: Page.Configuration.Constructor) {
    this.html = html;
    this.css = scss + EOL + css;
    this.js = js;
    this.data = data;
  }

  private build({ data = {}, vars = {} }: Page.Configuration.Build) {
    const _data = { ...this.data, ...data };
    return Template.create(page, _data, {
      ...vars,
      html: Template.create(this.html, _data).getContent(),
      css: this.css,
      js: this.js
    }).setTitle(_data.title || ''); // FIXME default title?
  }

  public popup(config: Page.Configuration.Popup) {
    return this.build(config);
  }

  public modal({ root, height, ...config }: Page.Configuration.Overlay) {
    const overlay = this.build(config);
    root.getUi().showModalDialog(overlay.setHeight(height), config.data.title);
  }

  public modeless({ root, height, ...config }: Page.Configuration.Overlay) {
    const overlay = this.build(config);
    root
      .getUi()
      .showModelessDialog(overlay.setHeight(height), config.data.title);
  }
}

export namespace Page {
  export namespace Configuration {
    export type Constructor = {
      html: string;
      css?: string;
      js?: string;
      data?: Template.Data;
    };

    export type Build = {
      data?: Template.Data;
      vars?: Template.Data;
    };

    export type Popup = Build & {
      data: { title: string };
    };

    export type Overlay = Popup & {
      root: UI.Dialog.Root;
      height?: number;
    };
  }

  export import Message = MMessage;

  export type Mode = 'overlay' | 'popup';
}

export default Page;
