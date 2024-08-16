import { Encoding } from '@gas-lighter/core';

export function get(sheet: GoogleAppsScript.Spreadsheet.Sheet, key: string) {
  const meta = sheet.createDeveloperMetadataFinder().withKey(key).find();
  if (meta && meta.length) {
    return Encoding.decodeWith(JSON.parse, meta.shift()?.getValue());
  }
  return null;
}

export function set(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  key: string,
  value: any
) {
  const str = Encoding.encodeWith(JSON.stringify, value);
  const meta = sheet.createDeveloperMetadataFinder().withKey(key).find();
  if (meta && meta.length) {
    return meta.shift()?.setValue(str);
  } else {
    return sheet.addDeveloperMetadata(key, str);
  }
}

export function remove(sheet: GoogleAppsScript.Spreadsheet.Sheet, key: string) {
  const meta = sheet.createDeveloperMetadataFinder().withKey(key).find();
  if (meta && meta.length) {
    return meta.shift()?.remove();
  }
  return null;
}
