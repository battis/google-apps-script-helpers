import MPaged from './Paged';
import MProgress from './Progress';

class Progress extends MProgress { }

namespace Progress {
  export import Paged = MPaged; // eslint-disable-line @typescript-eslint/no-unused-vars
}

export { Progress as default };
