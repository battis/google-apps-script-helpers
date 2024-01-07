import * as Callback from '../../../../../shared/Callback';
import * as Template from '../../../../Template';
import Input from '../../Input';
import select from './select.html';
import css from './select.scss';

export class Select extends Input {
  public constructor(private config: Select.Configuration) {
    super();
  }

  private _html?: GoogleAppsScript.HTML.HtmlOutput;

  protected standAlone(id: string) {}

  public getHtml(config: Input.Configuration = {}) {
    if (!this._html) {
      this._html = Template.create(select, {
        ...config,
        ...this.config,
        ...Callback.standardize({
          callback: this.config.options,
          functionKey: 'options',
          argsKey: 'optionsArgs'
        }),
        ...(this.config.callback
          ? Callback.standardize({
              callback: this.config.callback,
              argsKey: 'callbackArgs'
            })
          : {})
      });
    }
    return this._html;
  }

  public getCss() {
    return css;
  }
}

export namespace Select {
  export type Configuration = {
    options: Callback.Function;
    actionName?: string;
    callback?: Callback.Function;
    label?: string;
    help?: string;
  };

  export interface Pickable {
    name?: string;
    value: string | number;
    selected?: boolean;
  }
}

export default Select;
