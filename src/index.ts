import * as CacheService from './CacheService';
import * as CardService from './CardService';
import * as DriveApp from './DriveApp';
import * as Globals from './Globals';
import * as HtmlService from './HtmlService';
import * as PropertiesService from './PropertiesService';
import * as SpreadsheetApp from './SpreadsheetApp';
import * as UI from './UI';

const g = {
    CacheService,
    CardService,
    DriveApp,
    Globals,
    HtmlService,
    PropertiesService,
    SpreadsheetApp,
    UI,
};
export default g;

/** @deprecated */
export const Helper = {
    DriveApp,
    SpreadsheetApp,
};

/** @deprecated */
export const Terse = {
    CacheService,
    CardService,
    HtmlService,
    PropertiesService,
    SpreadsheetApp,
};
