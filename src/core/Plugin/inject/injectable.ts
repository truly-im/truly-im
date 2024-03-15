import "reflect-metadata";
export function injectable(name: string) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: TypedPropertyDescriptor<Function>
    ) {
        let method = descriptor.value;
        descriptor.value = function (...argv: any[]) {
            if (
                globalThis.injectList &&
                (globalThis.injectList as Map<string, Function>).has(name)
            ) {
                method = (globalThis.injectList as Map<string, Function>).get(
                    name
                );
            }
            console.log(method);
            return method.apply(this, argv);
        };
    };
}
