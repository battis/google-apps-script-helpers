import * as Template from '../../Template';
import Base from '../Base';
import html from './form.html';

export default class Form extends Base {
  public getHtml(config: Base.Configuration = {}) {
    return Template.create(html, config);
  }
}
