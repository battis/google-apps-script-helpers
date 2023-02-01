import DataWrapper from './Spreadsheet/DataWrapper';
import AssignableWrapper from './Spreadsheet/AssignableWrapper';

class S {
  public static fcn(name: string, ...args): string {
    return `${name}(${args.join(',')})`;
  }

  public static eq(a: string, b: string, stringify = true): string {
    return `${a}=${stringify ? JSON.stringify(b) : b}`;
  }

  public static char = this.fcn.bind(null, 'CHAR');
  public static filter = this.fcn.bind(null, 'FILTER');
  public static if = this.fcn.bind(null, 'IF');
  public static ifna = this.fcn.bind(null, 'IFNA');
  public static index = this.fcn.bind(null, 'INDEX');
  public static join = this.fcn.bind(null, 'JOIN');
  public static match = this.fcn.bind(null, 'MATCH');
  public static sort = this.fcn.bind(null, 'SORT');
  public static unique = this.fcn.bind(null, 'UNIQUE');

  public static openByIdAsData(id: string, sheet?: string) {
    return new DataWrapper(id, sheet);
  }

  public static getDataWrapperFor(
    sheet:
      | GoogleAppsScript.Spreadsheet.Spreadsheet
      | GoogleAppsScript.Spreadsheet.Sheet,
    name?: string
  ) {
    return new DataWrapper(sheet, name);
  }

  public static openByIdAsAssignable(id: string, sheet?: string) {
    return new AssignableWrapper(id, sheet);
  }

  public static getAssignableWrapperFor(
    sheet:
      | GoogleAppsScript.Spreadsheet.Spreadsheet
      | GoogleAppsScript.Spreadsheet.Sheet,
    name?: string
  ) {
    return new AssignableWrapper(sheet, name);
  }

  /**
   * Undocumented permissions API call
   * @see https://stackoverflow.com/a/68498535
   */
  public static addImportrangePermission(
    targetSpreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet,
    sourceSpreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet
  ) {
    UrlFetchApp.fetch(
      `https://docs.google.com/spreadsheets/d/${targetSpreadsheet.getId()}/externaldata/addimportrangepermissions?donorDocId=${sourceSpreadsheet.getId()}`,
      {
        method: 'post',
        headers: {
          Authorization: `Bearer ${ScriptApp.getOAuthToken()}`,
        },
        muteHttpExceptions: true,
      }
    );
  }
}

module S {
  // any type definitions for Helper.SpreadsheetApp
}

export default S;
