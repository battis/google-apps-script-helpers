class D {
  public static addPermission(
    fileId: string,
    email: string,
    role: D.Permission.Role = D.Permission.Role.Writer,
    type: D.Permission.Type = D.Permission.Type.User,
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
