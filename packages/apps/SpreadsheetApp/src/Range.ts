export const getEntireSheet = (sheet: GoogleAppsScript.Spreadsheet.Sheet) =>
  sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns());
