import MTracker from './Tracker';
import MView from './View';
import Kind from './Kind';

const Paged = { Kind, Tracker: MTracker, View: MView };

namespace Paged {
  export type Tracker = MTracker;
  export type View = MView;
}

export { Paged as default };
