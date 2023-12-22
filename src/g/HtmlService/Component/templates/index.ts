import Template from '../../Template';
import overlay from './overlay.html';
import popup from './popup.html';

export default class templates {
  public static overlay(component: string, data: Template.Data) {
    return Template.create(overlay, {
      ...data,
      component: Template.create(component, data).getContent()
    });
  }

  public static popup(component: string, data: Template.Data) {
    return Template.create(popup, {
      ...data,
      component: Template.create(component, data).getContent()
    });
  }
}
