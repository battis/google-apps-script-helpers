export default class HelperSpreadsheetApp {
    public static fcn(name: string, ...args): string {
        return `${name}(${args.join(',')})`;
    }

    public static eq(a: string, b: string, stringify = true): string {
        return `${a}=${stringify ? JSON.stringify(b) : b}`;
    }

    public static char = this.fcn.bind('CHAR');
    public static filter = this.fcn.bind('FILTER');
    public static if = this.fcn.bind('IF');
    public static ifna = this.fcn.bind('IFNA');
    public static index = this.fcn.bind('INDEX');
    public static join = this.fcn.bind('JOIN');
    public static match = this.fcn.bind('MATCH');
    public static sort = this.fcn.bind('SORT');
    public static unique = this.fcn.bind('UNIQUE');
}
