import Component from '../Component';
import * as Template from '../../Template';
import * as UI from '../../../UI';
import page from './page.html';
import style from './page.scss';
import EOL from '../../../shared/EOL';

export class Page extends Component {
  private components: Record<string, Component> = {};

  public getNamespace(): string {
    return 'g.HtmlService.Component.Page';
  }

  private html: string;

  public constructor({ html, css, js }: Page.Configuration.Init) {
    super(css, js);
    this.html = html;
  }

  public register(component: Component) {
    this.components[component.getNamespace()] = component;
    return this;
  }

  private build({ data = {}, vars = {} }: Page.Configuration.Build) {
    const _css = [style];
    const _js = [];
    Object.values(this.components).forEach((component) => {
      component.css && _css.push(component.css);
      component.js && _js.push(component.js);
    });
    return Template.create(page, data, {
      ...vars,
      css: [this.css, ..._css].join(EOL),
      js: [this.js, ..._js].join(EOL),
      html: this.html
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
    export type Init = {
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

  export type Mode = 'overlay' | 'popup';
}

export default Page;
