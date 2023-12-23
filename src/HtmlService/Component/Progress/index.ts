import defaultMessage from './templates/defaultMessage.html';

export const job = '<?!= data.job ?>';

export function update() {
  google.script.run
    .withSuccessHandler((progress) => {
      if (progress.html) {
        g.HtmlService.Template.replaceContent(progress.html);
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
      g.HtmlService.Template.replaceContent(complete.html);
    }
    if ('callback' in complete && 'page' in complete) {
      const args = complete.args || [];
      google.script.run[complete.callback](job, complete.page, ...args);
      update();
    }
  } else {
    try {
      google.script.host.close();
    } catch {
      g.HtmlService.Template.replaceContent(defaultMessage);
    }
  }
}

export function show() {
  g.HtmlService.Template.loading();
  update();
}

export namespace Init {
  export function overlay() {
    g.HtmlService.Template.loading();
    update();
  }

  export function popup() {
    g.HtmlService.Template.loading();
    google.script.run['<?!= data.callback ?>'](job);
    update();
  }
}
