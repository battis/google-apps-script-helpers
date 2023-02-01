export default class DataWrapper {
  private spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet;

  public constructor(
    spreadsheet: string | GoogleAppsScript.Spreadsheet.Spreadsheet
  ) {
    if (typeof spreadsheet == 'string') {
      this.spreadsheet = SpreadsheetApp.openById(spreadsheet);
    } else {
      this.spreadsheet = spreadsheet;
    }
  }

  public getSheetData(name: string, range?: string) {
    const sheet = this.spreadsheet.getSheetByName(name);
    if (!range) {
      return sheet.getSheetValues(
        1,
        1,
        sheet.getMaxRows(),
        sheet.getMaxColumns()
      );
    }
    return sheet.getRange(range).getValues();
  }
}
