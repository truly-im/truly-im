export interface injectList {
    [propName: string]: Function;
}

export function inject(thing: Function, name: string) {
    if (!globalThis.injectList) {
        globalThis.injectList = {};
    }
    globalThis.injectList[name] = thing;
}
