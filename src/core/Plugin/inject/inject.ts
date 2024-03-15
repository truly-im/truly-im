export function inject(thing: Function, name: string) {
    if (!globalThis.injectList) {
        globalThis.injectList = new Map<string, Function>();
    }
    globalThis.injectList.set(name, thing);
}
