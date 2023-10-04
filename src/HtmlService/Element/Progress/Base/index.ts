import MTracker from './Tracker';
import MView from './View';
import Kind from './Kind';

const Base = { Kind, Tracker: MTracker, View: MView };

namespace Base {
  export type Tracker = MTracker;
  export type View = MView;
}

export { Base as default };
