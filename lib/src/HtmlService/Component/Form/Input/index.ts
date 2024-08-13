import Page from '../../../Page';
import Base from '../../Base';
import _Select from './Select';
import html from './input.html';

export abstract class Input extends Base {
  protected abstract standAlone(id: string);

  public getPage(config: Base.Configuration = {}): Page {
    return new Page({ html, data: config });
  }
}

export namespace Input {
  export type Configuration = Base.Configuration;
  export import Select = _Select;
}

export default Input;
