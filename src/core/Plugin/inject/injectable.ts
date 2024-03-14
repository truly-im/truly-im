import "reflect-metadata";
import { injectList } from "./inject";
export function injectable(name: string) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: TypedPropertyDescriptor<Function>
    ) {
        let method = descriptor.value;
        descriptor.value = function () {
            if (globalThis.injectList && globalThis.injectList[name]) {
                method = (globalThis.injectList as injectList)[name];
            }
            console.log(method);
            return method.apply(this, arguments);
        };
    };
}
