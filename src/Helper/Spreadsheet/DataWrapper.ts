export default class DataWrapper {
  private spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet;
  private sheet?: GoogleAppsScript.Spreadsheet.Sheet;

  public constructor(
    spreadsheet: string | GoogleAppsScript.Spreadsheet.Spreadsheet,
    sheet?: string
  ) {
    if (typeof spreadsheet == 'string') {
      this.spreadsheet = SpreadsheetApp.openById(spreadsheet);
    } else {
      this.spreadsheet = spreadsheet;
    }
    if (sheet) {
      this.sheet = this.spreadsheet.getSheetByName(sheet);
    }
  }

  private getDataFrom(
    sheet: GoogleAppsScript.Spreadsheet.Sheet,
    range?: string
  ) {
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

  public getSheetData(name: string, range?: string) {
    return this.getDataFrom(this.spreadsheet.getSheetByName(name), range);
  }

  public getData(range?: string) {
    if (!this.sheet) {
      throw new Error('no sheet assigned');
    }
    return this.getDataFrom(this.sheet, range);
  }
}
