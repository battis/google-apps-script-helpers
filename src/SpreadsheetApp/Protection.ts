export function clearEditors(
  protection: GoogleAppsScript.Spreadsheet.Protection
) {
  protection.addEditor(Session.getEffectiveUser());
  /*
   * FIXME unapproved editors break this
   *   This is ridiculous: a student tried to share a file with an external
   *   user. The share was not approved. But the user was still associated
   *   _enough_ with the file that when I tried to _remove_ the user, it
   *   crashed the whole script.
   */
  protection.removeEditors(protection.getEditors());
  if (protection.canDomainEdit()) {
    protection.setDomainEdit(false);
  }
}
