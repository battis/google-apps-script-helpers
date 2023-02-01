const DriveAdvanced = Drive;

export namespace Helper {
  export namespace Drive {
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
  export class DriveApp {
    public static addPermission(
      fileId: string,
      email: string,
      role: Drive.Permission.Role = Drive.Permission.Role.Writer,
      type: Drive.Permission.Type = Drive.Permission.Type.User,
      optionalArgs: object = { sendNotificationEmails: false }
    ) {
      DriveAdvanced.Permissions.insert(
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
}
