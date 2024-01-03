import { type Picker as P } from './index';
import * as DOM from '../../client/DOM';
import * as Page from '../../Page/client';

class Picker {
  private select: HTMLSelectElement;

  public constructor(private container: HTMLElement) {
    this.select = DOM.querySelector<HTMLSelectElement>(container, 'select');
    this.load();
  }

  async load() {
    const options = await Page.Script.run<P.Options>(
      this.container.dataset.options,
      ...JSON.parse(this.container.dataset.optionsArgs)
    );
    this.select.innerHTML = options
      .map(
        (option) =>
          `<option value="${option.value}"${
            option.selected ? ' selected' : ''
          }>${option.name || option.value}</option>`
      )
      .join();
    const form = this.container.querySelector('form');
    form.addEventListener('submit', this.submitHandler);
  }

  async submitHandler(e: SubmitEvent) {
    e.preventDefault();
    (
      this.container.querySelector('button.submit') as HTMLButtonElement
    ).disabled = true;
    this.responseHandler(
      await Page.Script.run(
        this.container.dataset.callback,
        this.select.value,
        ...JSON.parse(this.container.dataset.callbackArgs)
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
