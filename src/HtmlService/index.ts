export * as Element from './Element';
export { Template };
import * as Template from './Template';

/** @deprecated use Template.{@link Template.include}() instead, as of v0.2.0 */
export const include = Template.include;

/** @deprecated use Template.{@link Template.createTemplate}() instead, as of v0.2.0 */
export const createTemplate = Template.createTemplate;

/** @deprecated use Template.{@link Template.createTemplateFromFile}() instead, as of v0.2.0 */
export const createTemplateFromFile = Template.createTemplateFromFile;
