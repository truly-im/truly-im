import { seededRandom } from "./random";
import { Buffer } from "buffer/";
const EC_GROUP_ORDER = Buffer.from('fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141', 'hex');
const ZERO32 = Buffer.alloc(32, 0);
function isScalar(x: any) {
    return Buffer.isBuffer(x) && x.length === 32;
}

function isValidPrivateKey(privateKey: Buffer) {
    if (!isScalar(privateKey)) {
        return false;
    }
    return privateKey.compare(ZERO32) > 0 && // > 0
        privateKey.compare(EC_GROUP_ORDER) < 0; // < G
}
function randomBytes() {
    const buffer = Buffer.allocUnsafe(32);
    for (let i = 0; i < 32; i++) {
        buffer.writeUInt8(seededRandom() * 10, i);
    }
    return buffer;
}
export function createPrivateKey() {
    var privateKey = randomBytes();

    while (!isValidPrivateKey(privateKey)) {
        privateKey = randomBytes();
    }
    return privateKey;
}