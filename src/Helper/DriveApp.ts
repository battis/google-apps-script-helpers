class D {
  private constructor() {}

  /**
   * @link https://developers.google.com/apps-script/guides/services/advanced#enable_advanced_services
   *   Use of this function requires enabling the Drive API service
   * @link https://developers.google.com/drive/api/v2/reference/permissions/insert
   *   optionalArgs documentation
   * @param {string} fileId
   * @param {string} email
   * @param {D.Permission.Role=D.Permission.Role.Writer} role
   * @param {D.Permission.Type=D.Permission.Type.User} type
   * @param {object={sendNotificationEmails:false}} optionalArgs
   */
  public static addPermission(
    fileId: string,
    email: string,
    role: D.Permission.Role = D.Permission.Role.Writer,
    type: D.Permission.Type = D.Permission.Type.User,
    optionalArgs: object = {
      sendNotificationEmails: false,
      supportsAllDrives: true,
    }
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

module D {
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
}

export default D;
