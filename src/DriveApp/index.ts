import * as Permission_module from './Permission';

namespace DriveApp {
    export import Permission = Permission_module;
}
export default DriveApp;

/** @deprecated */
export const addPermission = Permission_module.add;
