import * as Callback from '../../../shared/Callback';
import * as Template from '../../Template';
import Component from '../Component';
import picker from './picker.html';

export class Picker extends Component {
  public constructor(private config: Picker.Configuration) {
    super();
  }

  private _html?: string;

  public getHtml(): string {
    if (!this._html) {
      this._html = Template.create(picker, {
        ...this.config,
        ...Callback.standardize({
          callback: this.config.options,
          functionKey: 'options',
          argsKey: 'optionsArgs'
        }),
        ...Callback.standardize({
          callback: this.config.callback,
          argsKey: 'callbackArgs'
        })
      }).getContent();
    }
    return this._html;
  }
}

export namespace Picker {
  export type Configuration = {
    message?: string;
    options: Callback.Function;
    actionName?: string;
    callback: Callback.Function;
  };

  export type Options = {
    name?: string;
    value: string | number;
    selected?: boolean;
  }[];
}

export default Picker;
