import '../../../Google';
import * as Page from '../Page';
import defaultMessage from './defaultMessage.html';

function update(progress: HTMLElement) {
  google.script.run
    .withSuccessHandler((response) => {
      const progressBar = progress.querySelector(
        'progress'
      ) as HTMLProgressElement;
      if (progressBar) {
        progressBar.value = response.value;
        progressBar.max = response.max;
      }
      const status = progress.querySelector('.status');
      if (status) {
        status.innerHTML = response.status;
      }
      if (response.complete) {
        onComplete(progress, response.complete);
      } else {
        update(progress);
      }
    })
    .getProgress(progress.dataset.job);
}

function remaining(
  progress: HTMLElement,
  start: number,
  progressBar: HTMLProgressElement = progress.querySelector('progress'),
  timeRemaining: HTMLElement = progress.querySelector('.remaining')
) {
  if (progressBar && timeRemaining) {
    const estimate = [];
    let milliseconds = Math.floor(
      (progressBar.max - progressBar.value) *
        ((Date.now() - start) / progressBar.value)
    );
    function collect(unit: string, ms: number) {
      const collected = Math.floor(milliseconds / ms);
      if (collected >= 1) {
        milliseconds -= collected * ms;
        estimate.push(`${collected} ${collected > 1 ? `${unit}s` : unit}`);
      }
    }
    collect('hour', 60 * 60 * 1000);
    collect('minute', 60 * 1000);
    collect('second', 1000);
    timeRemaining.innerHTML = estimate.join(', ');
  }
  setTimeout(
    remaining.bind(null, progress, start, progressBar, timeRemaining),
    15
  );
}

function onComplete(progress: HTMLElement, complete) {
  if (typeof complete == 'object') {
    if ('html' in complete) {
      Page.replaceContent(complete.html);
    }
    if ('callback' in complete) {
      const progressBar = progress.querySelector('progress');
      if (progressBar) {
        progressBar.removeAttribute('value');
        progressBar.removeAttribute('max');
      }
      const args = complete.args || [];
      google.script.run[complete.callback](progress.dataset.job, ...args);
      update(progress);
    }
  } else {
    try {
      google.script.host.close();
    } catch {
      Page.replaceContent(defaultMessage);
    }
  }
}

export function init() {
  (Array.from(document.querySelectorAll('.g.pr')) as HTMLElement[]).forEach(
    (progress) => {
      remaining(progress, Date.now());
      switch (progress.dataset.mode) {
        case 'popup':
          initPopup(progress);
          break;
        case 'overlay':
        default:
          initOverlay(progress);
      }
    }
  );
}

function initOverlay(progress: HTMLElement) {
  update(progress);
}

function initPopup(progress: HTMLElement) {
  google.script.run[progress.dataset.callback](progress.dataset.job);
  update(progress);
}
