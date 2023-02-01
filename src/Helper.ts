import HelperSpreadsheetApp from './Helper/SpreadsheetApp';
import HelperDriveApp, { Permission as P } from './Helper/DriveApp';

export namespace HelperTypes {
  export namespace DriveApp {
    export namespace Permission {
      export type Role = P.Role;
      export type Type = P.Type;
    }
  }
}

export default class Helper {
  public static SpreadsheetApp = HelperSpreadsheetApp;
  public static DriveApp = HelperDriveApp;
}
