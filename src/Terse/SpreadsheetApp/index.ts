export * as DeveloperMetadata from './DeveloperMetadata';
export * as Protection from './Protection';

export function replaceWithDisplayValues(
    range: GoogleAppsScript.Spreadsheet.Range
) {
    range.setValues(range.getDisplayValues());
}

export function replaceAllWithDisplayValues(
    sheet: GoogleAppsScript.Spreadsheet.Sheet
) {
    replaceWithDisplayValues(
        sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns())
    );
}
