import Element_namespace from './Element';
import * as Template_module from './Template';

namespace HtmlService {
  export import Element = Element_namespace;
  export const createTemplate = Template_module.createTemplate;
  export const createTemplateFromFile = Template_module.createTemplateFromFile;
  export const include = Template_module.include;
}
export default HtmlService;
