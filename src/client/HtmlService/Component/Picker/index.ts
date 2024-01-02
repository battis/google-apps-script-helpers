import '../../../Google';
import * as Page from '../Page';
import templates from './templates';

const job = '<?!= data.job ?>';

const picker = {
  message: '<?!= data.picker.message ?>',
  list: '<?!= data.picker.list ?>',
  actionName: '<?!= data.picker.actionName ?>',
  callback: '<?!= data.picker.callback ?>',
  confirmation: '<?!= data.picker.confirmation ?>',
  confirm: '<?!= data.picker.confirm ?>'
};

let option: Record<string, any> = {};

function displayConfirmation() {
  Page.replaceContent(
    templates.confirmation({
      actionName: picker.actionName,
      option: option.name,
      confirmation: picker.confirmation,
      confirm: picker.confirm
    })
  );
  document.getElementById('confirmation').addEventListener('submit', (e) => {
    e.preventDefault();
    Page.loading();
    google.script.run[picker.callback](option.value, job);
  });
  document.getElementById('cancel').addEventListener('click', () => {
    google.script.host.close();
  });
}

function handleSubmit(e) {
  e.preventDefault();
  const opt = document.getElementById('options') as HTMLSelectElement;
  option = {
    value: opt.value,
    name: (
      document.querySelector(
        `#options option[value="${opt.value}"]`
      ) as HTMLOptionElement
    ).innerText
  };
  if (picker.confirmation.length) {
    displayConfirmation();
  } else {
    Page.loading();
    google.script.run[picker.callback](option.value, job);
  }
  return false;
}

function displayPicker(options) {
  if (picker.callback.length) {
    Page.replaceContent(
      templates.form({
        message: picker.message,
        options,
        actionName: picker.actionName
      })
    );
    document.getElementById('picker').addEventListener('submit', handleSubmit);
  } else {
    Page.replaceContent(templates.pickerCallbackUndefined);
    document
      .getElementById('#cancel')
      .addEventListener('click', () => google.script.host.close());
  }
}

export function init() {
  Page.loading();
  google.script.run.withSuccessHandler(displayPicker)[picker.list]();
}
