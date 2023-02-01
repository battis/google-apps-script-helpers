import Wrapper from './Wrapper';

export default class AssignableWrapper extends Wrapper {
  public set(
    sheet: string | GoogleAppsScript.Spreadsheet.Sheet,
    range: string,
    value
  ) {
    if (typeof sheet == 'string') {
      sheet = this.getSpreadsheet().getSheetByName(sheet);
    }
    const r = sheet.getRange(range);
    if (Array.isArray(value)) {
      if (!Array.isArray(value[0])) {
        value = [value];
      }
      r.setValues(value);
    } else {
      r.offset(0, 0, 1, 1).setValue(value);
    }
  }

  public setValue(range: string, value) {
    return this.set(this.getSheet(), range, value);
  }
}
