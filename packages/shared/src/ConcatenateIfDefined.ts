export function ConcatenateIfDefined(
  ...args: (string | undefined)[]
): string | undefined {
  return args.reduce((result, arg) => {
    result = (result || '') + (arg || '');
    return result === '' ? undefined : result;
  }, undefined);
}
