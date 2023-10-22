import lib from '../../../js/HtmlService/Component.js.html';
import head from './head.html';
import style from './style.scss';

class Template {
  public static create(html: string, data: Template.Data = {}) {
    const template = HtmlService.createTemplate(html);
    template.data = data;
    return template.evaluate();
  }

  public static createFromFile(filePath: string, data: Template.Data = {}) {
    let template: GoogleAppsScript.HTML.HtmlTemplate;
    switch (filePath) {
      case 'lib':
        template = HtmlService.createTemplate(lib);
        break;
      case 'style':
        template = HtmlService.createTemplate(`${head}<style>${style}</style>`);
        break;
      default:
        template = HtmlService.createTemplateFromFile(filePath);
    }
    template.data = data;
    return template.evaluate();
  }

  public static include(filePath: string, data?: Template.Data) {
    return Template.createFromFile(filePath, data).getContent();
  }
}

namespace Template {
  export type Data = Record<string, any>;
}

export { Template as default };
