import { sphincs } from "sphincs";
import secureRandom from "../Utils/secure-random";
let rng = new secureRandom();
function randomBytes(length) {
    const buffer = new Uint8Array(length);
    rng.nextBytes(buffer as any);
    return buffer;
}
export async function generateKeyPair() {
    let seed = randomBytes(96);
    return await sphincs.keyPairWithSeed(seed);
}
export const encrypt = (message: Uint8Array, privateKey: Uint8Array) =>
    sphincs.sign(message, privateKey);
export const decrypt = (message: Uint8Array, publicKey: Uint8Array) =>
    sphincs.open(message, publicKey);
/**
 *
 * @returns {Promise<Uint8Array>} signature
 */
export const detached = (message: Uint8Array, privateKey: Uint8Array) =>
    sphincs.signDetached(message, privateKey);
export const verifyDetached = (
    signature: Uint8Array,
    message: Uint8Array,
    publicKey: Uint8Array
) => sphincs.verifyDetached(signature, message, publicKey);
export class sphincsTransform implements TransformStream {
    readable: ReadableStream<any>;
    writable: WritableStream<any>;
    constructor(options: { privateKey?: Uint8Array; publicKey?: Uint8Array }) {
        let controller: ReadableStreamDefaultController;
        this.readable = new ReadableStream({
            start(readableController) {
                controller = readableController;
            },
        });
        let newWritableStream = (enqueue, key) =>
            new WritableStream({
                async write(uint8Array) {
                    controller.enqueue(await enqueue(uint8Array, key));
                },
                close() {
                    controller.close();
                },
            });
        if (options.privateKey) {
            this.writable = newWritableStream(sphincs.sign, options.privateKey);
        } else if (options.publicKey) {
            this.writable = newWritableStream(sphincs.open, options.publicKey);
        } else {
            throw new Error("privateKey and publicKey are not given!");
        }
    }
}
