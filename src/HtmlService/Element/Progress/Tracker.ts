import Model from './Model';
import View from './View';

interface Tracker extends Model {
  status: string;
  value: number;
  max: number;
  complete: Model.Completion;
  view: View;

  reset(): void;
}

namespace Tracker {
  export type Dataset<Page = any> = Iterable<Page>;
  export namespace Dataset {
    export type Callback = string | { functionName: string; args: any[] };
    export type Loader<Page = any> = (args: {
      start: number;
      end?: number;
      tracker: Tracker;
    }) => Dataset<Page>;
    export type Handler<Page = any> = (args: {
      page: Page;
      tracker: Tracker;
    }) => void;
  }
}

export { Tracker as default };
