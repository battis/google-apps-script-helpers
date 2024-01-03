import * as Picker from './Picker/client';
import * as Progress from './Progress/client';

export function init() {
  Picker.init();
  Progress.init();
}

export { Picker, Progress };
