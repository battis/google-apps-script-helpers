import Template from '../../../Template';
import base from './base.html';
import overlay from './overlay.html';
import paged from './paged.html';
import popup from './popup.html';
import progress from '../../../../../js/HtmlService/Element/Progress.js.html';

export default class templates {
  public static base(data: Template.Data) {
    return Template.create(base, data);
  }

  public static paged(data: Template.Data) {
    return Template.create(paged, data);
  }

  public static overlay(data: Template.Data) {
    return Template.create(overlay, {
      ...data,
      progress: Template.create(progress, data).getContent()
    });
  }

  public static popup(data: Template.Data) {
    return Template.create(popup, {
      ...data,
      progress: Template.create(progress, data).getContent()
    });
  }
}
