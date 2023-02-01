import Wrapper from './Wrapper';

export default class DataWrapper extends Wrapper {
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
    return this.getDataFrom(this.getSpreadsheet().getSheetByName(name), range);
  }

  public getData(range?: string) {
    return this.getDataFrom(this.getSheet(), range);
  }
}
