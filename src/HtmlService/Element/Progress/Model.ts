interface Model {
  job: Model.JobId;
  kind: string;
  complete: Model.Completion;
}

namespace Model {
  export type JobId = string;
  export type Completion = string | true | { html: string };
}

export { Model as default };
