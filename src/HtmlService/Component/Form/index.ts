import * as Callback from '../../../shared/Callback';
import * as Template from '../../Template';
import Base from '../Base';
import html from './form.html';

export class Form extends Base {
  public getHtmlOutput(config: Base.Configuration = {}) {
    return Template.create(html, config);
  }
}

export namespace Form {
  export type Configuration = Base.Configuration & {
    callback: Callback.Function;
    body: [];
  };
}

export default Form;
