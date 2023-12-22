import option from './option.html';
import form from './form.html';
import pickerCallbackUndefined from './pickerCallbackUndefined.html';
import confirmation from './confirmation.html';

export default class templates {
  public static pickerCallbackUndefined = pickerCallbackUndefined;

  private static template(html: string, data: Record<string, string>) {
    for (const tag in data) {
      html = html.replace(new RegExp(`<% *${tag} *%>`, 'g'), data[tag]);
    }
    return html;
  }

  public static option({
    name,
    value
  }: {
    name: string;
    value: string | number;
  }) {
    return this.template(option, { name, value: value.toString() });
  }

  public static form({
    message,
    options,
    actionName
  }: {
    message: string;
    options: [{ name: string; value: string | number }];
    actionName: string;
  }) {
    return this.template(form, {
      message,
      options: options.map(this.option).join(''),
      actionName
    });
  }

  public static confirmation({
    actionName,
    option,
    confirmation: c,
    confirm
  }: {
    actionName: string;
    option: string;
    confirmation: string;
    confirm: string;
  }) {
    return this.template(confirmation, {
      actionName,
      option,
      confirmation: c,
      confirm
    });
  }
}
