import Template from '../../Template';
import overlay from './overlay.html';
import popup from './popup.html';
import loading from './loading.html';

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
      progress: Template.create(component, data).getContent()
    });
  }

  public static loading() {
    return loading;
  }
}
