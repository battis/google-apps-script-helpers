import Wrapper from './Wrapper';

export default class AssignableWrapper extends Wrapper {
  public set(sheet: string, range: string, value) {
    const r = this.getSpreadsheet().getSheetByName(sheet).getRange(range);
    if (Array.isArray(value)) {
      if (!Array.isArray(value[0])) {
        value = [value];
      }
      r.setValues(value);
    } else {
      r.offset(0, 0, 1, 1).setValue(value);
    }
  }
}
