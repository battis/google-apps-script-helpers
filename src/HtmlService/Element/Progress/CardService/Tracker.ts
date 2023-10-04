import Paged from '../Paged';
import type PagedTracker from '../Paged/Tracker';
import Kind from './Kind';

class Tracker extends Paged.Tracker {
  public constructor(params) {
    super({ ...params, run: params.CardService.run });
    this.kind = Kind;
  }
}

namespace Tracker {
  export namespace Parameters {
    export type constructor<Page = any> =
      PagedTracker.Parameters.constructor<Page> & {
        CardService: { run: boolean };
      };
  }
}

export { Tracker as default };
