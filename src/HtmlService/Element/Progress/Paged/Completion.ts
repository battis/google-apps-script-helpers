import Model from '../Model';

type Completion =
  | Model.Completion
  | {
      callback: string;
      args: any[];
      step: number;
    };

export { Completion as default };
