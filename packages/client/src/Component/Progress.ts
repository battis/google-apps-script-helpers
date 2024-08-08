import * as DOM from '../DOM';
import * as Page from '../Page';

class Progress {
  private progressBar: HTMLProgressElement;
  private status: HTMLElement;
  private timeElapsed: HTMLElement;
  private timeRemaining: HTMLElement;
  private start = Date.now();

  public constructor(private container: HTMLElement) {
    this.progressBar = DOM.querySelector<HTMLProgressElement>(
      this.container,
      'progress'
    );
    this.status = DOM.querySelector(this.container, '.status');
    this.timeElapsed = DOM.querySelector(this.container, '.elapsed');
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

  private async update() {
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

  private duration(
    milliseconds: number,
    secMinCutoff = 5,
    secHourCutoff = 1,
    minHourCutoff = 12
  ) {
    const format = [];
    function collect(unit: string, ms: number) {
      const collected = Math.floor(milliseconds / ms);
      if (collected >= 1) {
        milliseconds -= collected * ms;
        format.push(`${collected} ${collected > 1 ? `${unit}s` : unit}`);
      }
      return collected;
    }
    const h = collect('hour', 60 * 60 * 1000);
    if (h < minHourCutoff) {
      const m = collect('minute', 60 * 1000);
      if (h < secHourCutoff && m < secMinCutoff) {
        collect('second', 1000);
      }
    }
    return format.join(', ');
  }

  private remaining(start: number) {
    this.timeElapsed.innerHTML = this.duration(Date.now() - this.start);
    this.timeRemaining.innerHTML = this.duration(
      Math.floor(
        (this.progressBar.max - this.progressBar.value) *
          ((Date.now() - start) / this.progressBar.value)
      )
    );
    setTimeout(this.remaining.bind(this, start), 50);
  }
}

export function init() {
  DOM.querySelectorAll(document.body, '.g.progress').forEach(
    (p) => new Progress(p)
  );
}
