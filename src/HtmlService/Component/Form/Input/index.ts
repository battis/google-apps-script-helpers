import Page from '../../../Page';
import Base from '../../Base';
import html from './formComponent.html';

export abstract class Input extends Base {
  protected abstract standAlone(id: string);

  public getPage(config: Base.Configuration = {}): Page {
    return new Page({ html, data: config });
  }
}

export namespace Input {
  export type Configuration = Base.Configuration;
}

export default Input;
