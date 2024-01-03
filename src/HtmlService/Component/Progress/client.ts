import * as Page from '../../Page/client';
import * as DOM from '../../client/DOM';

class Progress {
  private progressBar: HTMLProgressElement;
  private status: HTMLElement;
  private timeRemaining: HTMLElement;

  public constructor(private container: HTMLElement) {
    this.progressBar = DOM.querySelector<HTMLProgressElement>(
      this.container,
      'progress'
    );
    this.status = DOM.querySelector(this.container, '.status');
    this.timeRemaining = DOM.querySelector(this.container, '.remaining');

    if (this.container.dataset.callback) {
      Page.Script.run(
        this.container.dataset.callback,
        this.container.dataset.job
      );
    }
    this.update();
    this.remaining(Date.now());
  }

  async update() {
    const response: any = await Page.Script.run(
      'getProgress',
      this.container.dataset.job
    );

    this.progressBar.value = response.value;
    this.progressBar.max = response.max;
    this.status.innerHTML = response.status;

    if (response.callback) {
      if (this.progressBar) {
        this.progressBar.removeAttribute('value');
        this.progressBar.removeAttribute('max');
      }
      Page.Script.run(
        response.callback,
        this.container.dataset.job,
        ...(response.args || [])
      );
    }
    if (!response.complete) {
      this.update();
    }
  }

  remaining(start: number) {
    if (this.progressBar && this.timeRemaining) {
      const estimate = [];
      let milliseconds = Math.floor(
        (this.progressBar.max - this.progressBar.value) *
          ((Date.now() - start) / this.progressBar.value)
      );
      function collect(unit: string, ms: number) {
        const collected = Math.floor(milliseconds / ms);
        if (collected >= 1) {
          milliseconds -= collected * ms;
          estimate.push(`${collected} ${collected > 1 ? `${unit}s` : unit}`);
        }
        return collected;
      }
      const h = collect('hour', 60 * 60 * 1000);
      const m = collect('minute', 60 * 1000);
      if (h === 0 && m < 5) {
        collect('second', 1000);
      }
      this.timeRemaining.innerHTML = estimate.join(', ');
    }
    setTimeout(this.remaining.bind(this, start), 50);
  }
}

export function init() {
  DOM.querySelectorAll(document.body, '.g.progress').forEach(
    (p) => new Progress(p)
  );
}
