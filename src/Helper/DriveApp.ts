namespace Permission {
  export type Role =
    | 'owner'
    | 'organizer'
    | 'fileOrganizer'
    | 'writer'
    | 'reader';
  export type Type = 'user' | 'group' | 'domain' | 'anyone';
}
export default class HelperDriveApp {
  /**
   * Add write permission for the given user to the given document.
   *
   * Uses the Advanced Drive Service, which must be enabled.
   *
   * from: http://stackoverflow.com/a/37289790/1677912
   *
   * @param {string} fileId      Document ID to add permissions to.
   * @param {string} email  Email address of user to be given editor privileges.
   */
  public static addPermission(
    fileId: string,
    email: string,
    role: Permission.Role = 'writer',
    type: Permission.Type = 'user',
    optionalArgs: object = { sendNotificationEmails: false }
  ) {
    Drive.Permissions.insert(
      {
        role,
        type,
        value: email,
      },
      fileId,
      {
        ...optionalArgs,
      }
    );
  }
}
