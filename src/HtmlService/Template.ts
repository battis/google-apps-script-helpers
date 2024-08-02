// TODO better to encapsulate lib.html script objects in a single global object (g)
// TODO minify HTML templates
// TODO pre-bundle scripts embedded in templates
import lib from './lib.html';
import style from './style.html';

export function createTemplate(html: string, data = {}) {
  const template = HtmlService.createTemplate(html);
  template.data = data;
  return template.evaluate();
}

export function createTemplateFromFile(filePath: string, data = {}) {
  let template: GoogleAppsScript.HTML.HtmlTemplate;
  switch (filePath) {
    case 'lib':
      template = HtmlService.createTemplate(lib);
      break;
    case 'style':
      template = HtmlService.createTemplate(style);
      break;
    default:
      template = HtmlService.createTemplateFromFile(filePath);
  }
  template.data = data;
  return template.evaluate();
}

export const include = (filePath: string, data?: object) =>
  createTemplateFromFile(filePath, data).getContent();
