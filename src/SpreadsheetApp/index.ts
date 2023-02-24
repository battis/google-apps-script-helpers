import * as Dialog_module from '../UI/Dialog';
import * as DeveloperMetadata_module from './DeveloperMetadata';
import * as Function_module from './Function';
import * as Permission_module from './Permission';
import * as Protection_module from './Protection';
import * as Value_module from './Value';

namespace SpreadsheetApp_namespace {
    export const Dialog = Dialog_module.bindTo(SpreadsheetApp);
    export import Function = Function_module;
    export import Permission = Permission_module;
    export import Value = Value_module;
    export import DeveloperMetadata = DeveloperMetadata_module;
    export import Protection = Protection_module;
}
export default SpreadsheetApp_namespace;

/** @deprecated */
export const addImportrangePermission =
    Permission_module.addImportrangePermission;

/** @deprecated */
export const setValue = Value_module.set;
/** @deprecated */
export const replaceWithDisplayValues = Value_module.replaceWithDisplayValues;
/** @deprecated */
export const getSheetDisplayValues = Value_module.getSheetDisplayValues;

/** @deprecated */
export const fcn = Function_module.fcn;
/** @deprecated */
export const eq = Function_module.eq;
/** @deprecated */
export const CHAR = Function_module.CHAR;
/** @deprecated */
export const FILTER = Function_module.FILTER;
/** @deprecated */
export const IF = Function_module.IF;
/** @deprecated */
export const IFNA = Function_module.IFNA;
/** @deprecated */
export const INDEX = Function_module.INDEX;
/** @deprecated */
export const JOIN = Function_module.JOIN;
/** @deprecated */
export const MATCH = Function_module.MATCH;
/** @deprecated */
export const SORT = Function_module.SORT;
/** @deprecated */
export const UNIQUE = Function_module.UNIQUE;
