/**
 * Google.ts
 * @battis/gas-lighter
 *
 * Typing for client-side Google Apps Script
 * @see https://developers.google.com/apps-script/guides/html/reference/history
 *
 * @author Seth Battis
 */

type LocationObject = {
  hash: string;
  parameter: Record<string, string>;
  parameters: Record<string, string[]>;
};

type RunModule = {
  [serverSideFunction: string]: (...args: any[]) => void;
  withFailureHandler: (
    handler: (err: Error, userObject: object) => void
  ) => RunModule;
  withSuccessHandler: (
    handler: (returnValue: any, userObject: object) => void
  ) => RunModule;
  withUserObject: (userObject: object) => RunModule;
};

declare const google: {
  script: {
    history: {
      push: (stateObject: object, params: object, hash: string) => void;
      replace: (stateObject: object, params: object, hash: string) => void;
      setChangeHandler: (
        func: (e: { state: object; location: LocationObject }) => void
      ) => void;
    };
    host: {
      origin: string;
      close: () => void;
      editor: { focus: () => void };
      setHeight: (height: number) => void;
      setWidth: (width: number) => void;
    };
    run: RunModule;
    url: {
      getLocation: (func: (location: LocationObject) => void) => void;
    };
  };
};
