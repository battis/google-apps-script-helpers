import PagedCommon from '../Paged/Common';

const Common = {
  ...PagedCommon,

  KIND: 'card'
};

namespace Common {
  export type Completion = PagedCommon.Completion;
}

export { Common as default };
