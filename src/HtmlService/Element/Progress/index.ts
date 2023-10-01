import MBase from './Base';
import MPaged from './Paged';
import MCardService from './CardService';
import './index.global';

const Progress = {
  ...MBase,
  Paged: MPaged,
  CardService: MCardService
};

export { Progress as default };
