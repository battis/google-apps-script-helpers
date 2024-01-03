import * as Template from '../Template';
import * as UI from '../../UI';
import page from './page.html';
import css from './page.scss';
import EOL from '../../shared/EOL';
import MMessage from './Message';

export class Page {
  private html: string;
  private css?: string;
  private js?: string;

  public constructor({
    html = '',
    css: _css,
    js
  }: Page.Configuration.Constructor) {
    this.html = html;
    this.css = css + EOL + _css;
    this.js = js;
  }

  private build({ data = {}, vars = {} }: Page.Configuration.Build) {
    return Template.create(page, data, {
      ...vars,
      ...this
    }).setTitle(data.title);
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
