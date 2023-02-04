import E from './HtmlElement';

class H {
  public static include(filePath: string, data?: object) {
    const template = HtmlService.createTemplateFromFile(filePath);
    template.data = data;
    return template.evaluate().getContent();
  }
}

module H {
  export const Element = E;
}

export default H;
