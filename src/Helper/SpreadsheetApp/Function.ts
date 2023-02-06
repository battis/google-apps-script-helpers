export function fcn(name: string, ...args): string {
  return `${name}(${args.join(',')})`;
}

export function eq(a: string, b: string, stringify = true): string {
  return `${a}=${stringify ? JSON.stringify(b) : b}`;
}

export const CHAR = fcn.bind(null, 'CHAR');
export const FILTER = fcn.bind(null, 'FILTER');
export const IF = fcn.bind(null, 'IF');
export const IFNA = fcn.bind(null, 'IFNA');
export const INDEX = fcn.bind(null, 'INDEX');
export const JOIN = fcn.bind(null, 'JOIN');
export const MATCH = fcn.bind(null, 'MATCH');
export const SORT = fcn.bind(null, 'SORT');
export const UNIQUE = fcn.bind(null, 'UNIQUE');
