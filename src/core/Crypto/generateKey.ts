import secureRandom from "../Utils/secure-random";
let rng = new secureRandom();
import { Buffer } from "buffer/";
const EC_GROUP_ORDER = Buffer.from(
    "fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141",
    "hex"
);
const ZERO32 = Buffer.alloc(32, 0);
function isScalar(x: any) {
    return Buffer.isBuffer(x) && x.length === 32;
}

export function isValidPrivateKey(privateKey: Buffer) {
    if (!isScalar(privateKey)) {
        return false;
    }
    return (
        privateKey.compare(ZERO32) > 0 && // > 0
        privateKey.compare(EC_GROUP_ORDER) < 0
    ); // < G
}
function randomBytes() {
    const buffer = Buffer.allocUnsafe(32);
    rng.nextBytes(buffer as any);
    return buffer;
}
export function createPrivateKey() {
    var privateKey = randomBytes();

    while (!isValidPrivateKey(privateKey)) {
        privateKey = randomBytes();
    }
    return privateKey;
}
