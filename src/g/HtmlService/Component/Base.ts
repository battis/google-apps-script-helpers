import templates from './templates';
import Template from '../Template';
import * as UI from '../../UI';
import style from './style.scss';

abstract class Base {
  protected abstract getLib(data: Template.Data): string;

  public popup(data: Base.Params.Popup) {
    return templates
      .popup(this.getLib(data), this.appendStyle(style, data))
      .setTitle(data.title);
  }

  public modal({ root, ...data }: Base.Params.Overlay) {
    root
      .getUi()
      .showModalDialog(
        templates
          .overlay(this.getLib(data), this.appendStyle(style, data))
          .setHeight(data.height),
        data.title
      );
  }

  public modeless({ root, ...data }: Base.Params.Overlay) {
    root
      .getUi()
      .showModelessDialog(
        templates
          .overlay(this.getLib(data), this.appendStyle(style, data))
          .setHeight(data.height),
        data.title
      );
  }

  protected appendStyle(style: string, data: { script?: string }) {
    const append = `s=document.createElement('style');s.innerHTML='${style}';document.head.append(s);`;
    if (data.script) {
      data.script = append + data.script;
    } else {
      data.script = append;
    }
    return data;
  }
}

namespace Base {
  export namespace Params {
    export type Popup = {
      title?: string;
      data?: Template.Data;
      header?: string;
      footer?: string;
      script?: string;
    };

    export type Overlay = Popup & {
      root: UI.Dialog.Root;
      height?: number;
    };
  }
}

export { Base as default };
