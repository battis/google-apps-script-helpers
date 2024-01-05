import * as Page from '../../Page/client';
import * as DOM from '../../client/DOM';
import { type Picker as P } from './index';

class Picker {
  private select: HTMLSelectElement;
  private form?: HTMLFormElement;

  public constructor(private container: HTMLElement) {
    this.select = container.querySelector('select');
    this.form = container.querySelector('form');
    this.load();
  }

  async load() {
    const options = await Page.Script.run<P.Pickable[]>(
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

  async submitHandler(e: SubmitEvent) {
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

  responseHandler(response) {
    if ('html' in response) {
      this.container.outerHTML = response.html;
    }
  }
}

export function init() {
  DOM.querySelectorAll(document.body, '.g.picker').forEach(
    (p) => new Picker(p)
  );
}
