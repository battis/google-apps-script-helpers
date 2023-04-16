export function clearEditors(
  protection: GoogleAppsScript.Spreadsheet.Protection
) {
  protection.addEditor(Session.getEffectiveUser());
  protection.removeEditors(protection.getEditors());
  if (protection.canDomainEdit()) {
    protection.setDomainEdit(false);
  }
}
