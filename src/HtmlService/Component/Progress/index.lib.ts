/// <reference path="../../index.lib.d.ts" />

import placeholder from './templates/placeholder.html';
import defaultMessage from './templates/defaultMessage.html';
import './style.scss';

export { placeholder };

export const job = '<?!= data.job || data.thread ?>';

export function update() {
  google.script.run
    .withSuccessHandler((progress) => {
      if (progress.html) {
        g.HtmlService.replaceContent(progress.html);
      }
      if (progress.complete) {
        onComplete(progress.complete);
      } else {
        update();
      }
    })
    .getProgress(job);
}

export function onComplete(complete) {
  if (typeof complete == 'object') {
    if ('html' in complete) {
      g.HtmlService.replaceContent(complete.html);
    }
    if ('callback' in complete && 'step' in complete) {
      const args = complete.args || [];
      google.script.run[complete.callback](job, complete.step, ...args);
      update();
    }
  } else {
    try {
      google.script.host.close();
    } catch {
      document.querySelector('.message').innerHTML = defaultMessage;
    }
  }
}

export function show() {
  g.HtmlService.replaceContent(placeholder);
  update();
}
