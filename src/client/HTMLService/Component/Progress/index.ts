import defaultMessage from '../../../../server/HtmlService/Component/Progress/templates/defaultMessage.html';
import '../../../../server/HtmlService/Component/Progress/style.scss';

export default class Progress {
  public static job = '<?!= data.job || data.thread ?>';

  public static update() {
    google.script.run
      .withSuccessHandler((progress) => {
        if (progress.html) {
          g.HtmlService.Component.replaceContent(progress.html);
        }
        if (progress.complete) {
          this.onComplete(progress.complete);
        } else {
          this.update();
        }
      })
      .getProgress(this.job);
  }

  public static onComplete(complete) {
    if (typeof complete == 'object') {
      if ('html' in complete) {
        g.HtmlService.Component.replaceContent(complete.html);
      }
      if ('callback' in complete && 'step' in complete) {
        const args = complete.args || [];
        google.script.run[complete.callback](this.job, complete.step, ...args);
        this.update();
      }
    } else {
      try {
        google.script.host.close();
      } catch {
        document.querySelector('.message').innerHTML = defaultMessage;
      }
    }
  }

  public static show() {
    g.HtmlService.Component.loading();
    this.update();
  }

  public static Init = {
    overlay: () => {
      g.HtmlService.Component.loading();
      this.update();
    },

    popup: () => {
      g.HtmlService.Component.loading();
      google.script.run['<?!= data.callback ?>'](this.job);
      this.update();
    }
  };
}
