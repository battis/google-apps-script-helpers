import Batch from './Batch';
import RequestType from './Request';
import Response from './Response';

const API = { Batch, Response };

namespace API {
  export type Request = RequestType;
}

export default API;
