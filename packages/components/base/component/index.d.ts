import '@gas-lighter/google-runtime';
export declare function querySelector<T extends Element = HTMLElement>(parentElement: Element, selector: string): T;
export declare function querySelectorAll<T extends Element = HTMLElement>(parentElement: Element, selector: string): T[];
export declare function create<T extends Element = HTMLElement>(html: string): HTMLDivElement | T;
export declare function replaceContent(html: string): void;
export declare function loading(): void;
export declare function close(): void;
export declare namespace Script {
    function run<T extends Record<string, any> = Record<string, any>>(functionName: string, ...args: any[]): Promise<T>;
}
