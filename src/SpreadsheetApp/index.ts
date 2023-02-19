import * as F from './Function';
import * as P from './Permission';
import * as V from './Value';

export * as DeveloperMetadata from './DeveloperMetadata';
export * as Protection from './Protection';

/** @deprecated */
export const addImportrangePermission = P.addImportrangePermission;

export const Permission = P;

/** @deprecated */
export const setValue = V.set;
/** @deprecated */
export const replaceWithDisplayValues = V.replaceWithDisplayValues;
/** @deprecated */
export const getSheetDisplayValues = V.getSheetDisplayValues;

export const Value = V;

/** @deprecated */
export const fcn = F.fcn;
/** @deprecated */
export const eq = F.eq;
/** @deprecated */
export const CHAR = F.CHAR;
/** @deprecated */
export const FILTER = F.FILTER;
/** @deprecated */
export const IF = F.IF;
/** @deprecated */
export const IFNA = F.IFNA;
/** @deprecated */
export const INDEX = F.INDEX;
/** @deprecated */
export const JOIN = F.JOIN;
/** @deprecated */
export const MATCH = F.MATCH;
/** @deprecated */
export const SORT = F.SORT;
/** @deprecated */
export const UNIQUE = F.UNIQUE;

export const Function = F;
