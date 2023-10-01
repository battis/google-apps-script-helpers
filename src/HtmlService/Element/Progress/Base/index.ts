import TTracker from './Tracker';
import TView from './View';
import Common from './Common';

const Base = { ...TTracker, ...Common, Tracker: TTracker, View: TView };

namespace Base {
  export type Tracker = TTracker;
  export type View = TView;
  export type Completion = Common.Completion;
}

export { Base as default };
