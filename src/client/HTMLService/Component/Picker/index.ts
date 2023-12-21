import templates from '../../../../server/HtmlService/Component/Picker/templates';

export default class Picker {
  private static job = '<?!= data.job ?>';

  private static picker = {
    message: '<?!= data.picker.message ?>',
    list: '<?!= data.picker.list ?>',
    actionName: '<?!= data.picker.actionName ?>',
    callback: '<?!= data.picker.callback  ?>',
    confirmation: '<?!= data.picker.confirmation ?>',
    confirm: '<?!= data.picker.confirm ?>'
  };

  private static option: Record<string, any> = {};

  private static displayConfirmation() {
    g.HtmlService.Component.replaceContent(
      templates.confirmation({
        actionName: this.picker.actionName,
        option: this.option.name,
        confirmation: this.picker.confirmation,
        confirm: this.picker.confirm
      })
    );
    document.getElementById('confirmation').addEventListener('submit', (e) => {
      e.preventDefault();
      g.HtmlService.Component.loading();
      google.script.run[this.picker.callback](this.option.value, this.job);
    });
    document.getElementById('cancel').addEventListener('click', () => {
      google.script.host.close();
    });
  }

  private static handleSubmit(e) {
    e.preventDefault();
    const opt = document.getElementById('options') as HTMLSelectElement;
    this.option = {
      value: opt.value,
      name: (
        document.querySelector(
          `#options option[value="${opt.value}"]`
        ) as HTMLOptionElement
      ).innerText
    };
    if (this.picker.confirmation.length) {
      this.displayConfirmation();
    } else {
      g.HtmlService.Component.loading();
      google.script.run[this.picker.callback](this.option.value, this.job);
    }
    return false;
  }

  private static displayPicker(options) {
    if (this.picker.callback.length) {
      g.HtmlService.Component.replaceContent(
        templates.form({
          message: this.picker.message,
          options,
          actionName: this.picker.actionName
        })
      );
      document
        .getElementById('picker')
        .addEventListener('submit', this.handleSubmit);
    } else {
      g.HtmlService.Component.replaceContent(templates.pickerCallbackUndefined);
      document
        .getElementById('#cancel')
        .addEventListener('click', () => google.script.host.close());
    }
  }

  public static init() {
    g.HtmlService.Component.loading();
    google.script.run
      .withSuccessHandler(this.displayPicker)
      [this.picker.list]();
  }
}
