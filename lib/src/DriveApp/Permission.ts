export enum Role {
  Owner = 'owner',
  Organizer = 'organizer',
  FileOrganizer = 'fileOrganizer',
  Writer = 'writer',
  Reader = 'reader'
}

export enum Type {
  User = 'user',
  Group = 'group',
  Domain = 'domain',
  Anyone = 'anyone'
}

/**
 * Use of this function requires {@link https://developers.google.com/apps-script/guides/services/advanced#enable_advanced_services| enabling the Drive API service}
 *
 * {@link https://developers.google.com/drive/api/v2/reference/permissions/insert| optionalArgs documentation}
 */
export function add(
  fileId: string,
  email: string,
  role: Role = Role.Writer,
  type: Type = Type.User,
  optionalArgs: object = {
    sendNotificationEmails: false,
    supportsAllDrives: true
  }
) {
  Drive.Permissions.insert(
    {
      role,
      type,
      value: email
    },
    fileId,
    {
      ...optionalArgs
    }
  );
}
