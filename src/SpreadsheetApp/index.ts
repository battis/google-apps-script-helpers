import * as Dialog from '../UI/Dialog';
import * as DeveloperMetadata from './DeveloperMetadata';
import * as Function from './Function';
import * as Permission from './Permission';
import * as Protection from './Protection';
import * as Range from './Range';
import * as Value from './Value';

export default {
    Dialog: Dialog.bindTo(SpreadsheetApp),
    DeveloperMetadata,
    Function,
    Permission,
    Protection,
    Range,
    Value
};
