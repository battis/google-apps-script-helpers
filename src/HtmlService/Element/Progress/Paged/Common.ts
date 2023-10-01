import BaseCommon from '../Base/Common';

const Common = {
  ...BaseCommon,

  KIND: 'paged',

  KEY_END_TIME: 'endTime'
};

namespace Common {
  export type Completion =
    | BaseCommon.Completion
    | { callback: string; step: number; args?: any[] };
}

export { Common as default };
