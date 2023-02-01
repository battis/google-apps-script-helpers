export namespace Permission {
  export enum Role {
    Owner = 'owner',
    Organizer = 'organizer',
    FileOrganizer = 'fileOrganizer',
    Writer = 'writer',
    Reader = 'reader',
  }
  export enum Type {
    User = 'user',
    Group = 'group',
    Domain = 'domain',
    Anyone = 'anyone',
  }
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
    role: Permission.Role = Permission.Role.Writer,
    type: Permission.Type = Permission.Type.User,
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
