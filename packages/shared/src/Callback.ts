export type Function = string | { functionName: string; args: any[] };

export function getFunctionName(callback: Function) {
  if (typeof callback === 'string') {
    return callback;
  }
  return callback.functionName;
}

export function getArgs(callback: Function) {
  if (typeof callback === 'string') {
    return [];
  }
  return callback.args;
}

export function standardize({
  callback,
  functionKey = 'callback',
  argsKey = 'args'
}: {
  callback: Function;
  functionKey?: string;
  argsKey?: string;
}) {
  return {
    [functionKey]: getFunctionName(callback),
    [argsKey]: getArgs(callback)
  };
}
