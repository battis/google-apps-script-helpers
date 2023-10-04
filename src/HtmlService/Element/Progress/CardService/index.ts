import MTracker from './Tracker';
import MView from './View';
import Kind from '../Paged/Kind';

const CardService = { Kind, Tracker: MTracker, View: MView };

namespace CardService {
  export type Tracker = MTracker;
  export type View = MView;
}

export { CardService as default };
