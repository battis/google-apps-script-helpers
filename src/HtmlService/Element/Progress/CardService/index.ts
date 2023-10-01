import TTracker from './Tracker';
import TView from './View';
import Common from './Common';

const CardService = { ...TTracker, ...Common, Tracker: TTracker, View: TView };

namespace CardService {
  export type Tracker = TTracker;
  export type View = TView;
  export type Completion = Common.Completion;
}

export { CardService as default };
