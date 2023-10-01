import PCommon from '../Common';

const Common = {
  ...PCommon,

  KIND: 'base',

  KEY_STATUS: 'status',
  KEY_VALUE: 'value',
  KEY_MAX: 'max',
  KEY_COMPLETE: 'complete'
};

namespace Common {
  export type Completion =
    | string
    | true
    | { html: string }
    | Record<string, any>;
}

export { Common as default };
