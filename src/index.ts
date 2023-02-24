import * as CacheService_module from './CacheService';
import CardService_namespace from './CardService';
import DriveApp_namespace from './DriveApp';
import * as Globals_module from './Globals';
import HtmlService_namespace from './HtmlService';
import * as PropertiesService_module from './PropertiesService';
import SpreadsheetApp_namespace from './SpreadsheetApp';
import UI_namespace from './UI';

namespace g {
    export import CacheService = CacheService_module;
    export import CardService = CardService_namespace;
    export import DriveApp = DriveApp_namespace;
    export import Globals = Globals_module;
    export import HtmlService = HtmlService_namespace;
    export import PropertiesService = PropertiesService_module;
    export import SpreadsheetApp = SpreadsheetApp_namespace;
    export import UI = UI_namespace;
}
export default g;

/** @deprecated */
export namespace Helper {
    export import DriveApp = DriveApp_namespace;
    export import SpreadsheetApp = SpreadsheetApp_namespace;
}

/** @deprecated */
export namespace Terse {
    export import CacheService = CacheService_module;
    export import CardService = CardService_namespace;
    export import HtmlService = HtmlService_namespace;
    export import PropertiesService = PropertiesService_module;
    export import SpreadsheetApp = SpreadsheetApp_namespace;
}
