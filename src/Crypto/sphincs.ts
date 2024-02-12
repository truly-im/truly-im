import { sphincs } from "sphincs"
import { seededRandom } from "./random"
function randomBytes(length) {
    const buffer = new Uint8Array(length)
    for (let i = 0; i < length; i++) {
        buffer[i] = seededRandom() * 255;
    }
    return buffer;
}
export async function generateKeyPair() {
    let seed = randomBytes(96);
    return await sphincs.keyPairWithSeed(seed);

}
export const encrypt = (message: Uint8Array, privateKey: Uint8Array) => sphincs.sign(message, privateKey)
export const decrypt = (message: Uint8Array, publicKey: Uint8Array) => sphincs.open(message, publicKey)
/**
 * 
 * @returns {Promise<Uint8Array>} signature
 */
export const detached = (message: Uint8Array, privateKey: Uint8Array) => sphincs.signDetached(message, privateKey)
export const verifyDetached = (signature: Uint8Array, message: Uint8Array, publicKey: Uint8Array) => sphincs.verifyDetached(signature, message, publicKey)