import MBase from './Base';
import MPaged from './Paged';
import Factory from './Factory';

const Progress = {
  ...MBase,
  Paged: MPaged,
  getProgress: Factory.getProgress.bind(Factory)
};

export { Progress as default };
