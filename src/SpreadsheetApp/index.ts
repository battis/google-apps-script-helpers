import * as Dialog_module from '../UI/Dialog';
import * as DeveloperMetadata_module from './DeveloperMetadata';
import * as Function_module from './Function';
import * as Permission_module from './Permission';
import * as Protection_module from './Protection';
import * as Value_module from './Value';

namespace SpreadsheetApp_namespace {
    export const Dialog =
        Dialog_module.bindTo<typeof SpreadsheetApp>(SpreadsheetApp);
    export import Function = Function_module;
    export import Permission = Permission_module;
    export import Value = Value_module;
    export import DeveloperMetadata = DeveloperMetadata_module;
    export import Protection = Protection_module;
}
export default SpreadsheetApp_namespace;
