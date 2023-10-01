import TTracker from './Tracker';
import TView from './View';
import Common from './Common';

const Paged = { ...TTracker, ...Common, Tracker: TTracker, View: TView };

namespace Paged {
  export type Tracker = TTracker;
  export type View = TView;
  export type Completion = Common.Completion;
}

export { Paged as default };
