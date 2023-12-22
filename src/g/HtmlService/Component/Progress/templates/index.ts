import Template from '../../../Template';
import base from './base.html';
import paged from './paged.html';

export default class templates {
  public static base(data: Template.Data) {
    return Template.create(base, data);
  }

  public static paged(data: Template.Data) {
    return Template.create(paged, data);
  }
}
