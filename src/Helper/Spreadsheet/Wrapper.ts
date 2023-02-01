export default class Wrapper {
  private spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet;
  private sheet?: GoogleAppsScript.Spreadsheet.Sheet;

  public constructor(
    id:
      | string
      | GoogleAppsScript.Spreadsheet.Spreadsheet
      | GoogleAppsScript.Spreadsheet.Sheet,
    name?: string
  ) {
    if (typeof id == 'string') {
      this.spreadsheet = SpreadsheetApp.openById(id);
    } else if (id.getRange) {
      this.sheet = id as GoogleAppsScript.Spreadsheet.Sheet;
      this.spreadsheet = this.sheet.getParent();
    } else {
      this.spreadsheet = id as GoogleAppsScript.Spreadsheet.Spreadsheet;
    }
    if (!this.sheet && name) {
      this.sheet = this.spreadsheet.getSheetByName(name);
    }
  }

  protected getSpreadsheet() {
    return this.spreadsheet;
  }

  protected getSheet() {
    return this.sheet;
  }
}
