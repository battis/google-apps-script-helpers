import { type Select as S } from '../../../../../../lib/src/HtmlService/Component/Form/Input/Select';
import * as DOM from '../../../DOM';
import * as Page from '../../../Page';

class Select {
  private select: HTMLSelectElement;
  private form?: HTMLFormElement;

  public constructor(private container: HTMLElement) {
    this.select = container.querySelector('select');
    this.form = container.querySelector('form');
    this.load();
  }

  private async load() {
    const options = await Page.Script.run<S.Pickable[]>(
      this.container.dataset.options,
      ...JSON.parse(this.container.dataset.optionsArgs || '[]')
    );
    this.select.innerHTML = options
      .map(
        (option) =>
          `<option value="${option.value}"${
            option.selected ? ' selected' : ''
          }>${option.name || option.value}</option>`
      )
      .join('');
    this.form?.addEventListener('submit', this.submitHandler.bind(this));
  }

  private async submitHandler(e: SubmitEvent) {
    e.preventDefault();
    this.form.querySelector('button').disabled = true;
    this.responseHandler(
      await Page.Script.run(
        this.container.dataset.callback,
        this.select.value,
        ...JSON.parse(this.container.dataset.callbackArgs || '[]')
      )
    );
  }

  private responseHandler(response) {
    if ('html' in response) {
      this.container.outerHTML = response.html;
    }
  }
}

export function init() {
  DOM.querySelectorAll(document.body, '.g.select').forEach(
    (elt) => new Select(elt)
  );
}
