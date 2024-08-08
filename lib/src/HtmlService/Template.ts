import client from '@battis/gas-lighter.client/dist/client.html';

function build(
  template: GoogleAppsScript.HTML.HtmlTemplate,
  data: Data = {},
  vars: Data = {}
) {
  template.data = data;
  for (const prop in vars) {
    template[prop] = vars[prop];
  }
  return template.evaluate();
}

export function create(html: string, data: Data = {}, vars: Data = {}) {
  const template = HtmlService.createTemplate(html);
  return build(template, data, vars);
}

export function createFromFile(
  filePath: string,
  data: Data = {},
  vars: Data = {}
) {
  const template = HtmlService.createTemplateFromFile(filePath);
  return build(template, data, vars);
}

export function include(filePath: string, data: Data) {
  switch (filePath) {
    case 'client':
      return create(client, data).getContent();
    default:
      return createFromFile(filePath, data).getContent();
  }
}

export type Data = Record<string, any>;
