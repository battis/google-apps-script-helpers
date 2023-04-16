/**
 * Undocumented permissions API call
 * @see https://stackoverflow.com/a/68498535
 */
export function addImportrangePermission(
  targetSpreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet,
  sourceSpreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet
) {
  UrlFetchApp.fetch(
    `https://docs.google.com/spreadsheets/d/${targetSpreadsheet.getId()}/externaldata/addimportrangepermissions?donorDocId=${sourceSpreadsheet.getId()}`,
    {
      method: 'post',
      headers: {
        Authorization: `Bearer ${ScriptApp.getOAuthToken()}`
      },
      muteHttpExceptions: true
    }
  );
}
