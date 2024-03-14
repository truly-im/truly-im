import { Buffer } from "buffer/";
import { secp256k1 } from "@noble/curves/secp256k1";
import secureRandom from "../Utils/secure-random";
import JSChaCha20 from "js-chacha20";
import * as blake from "blakejs";
import * as sphincs from "./sphincs";
import { injectable } from "../Plugin/inject/injectable";
function randomBytes(length) {
    let rand = new secureRandom(),
        randArray = new Array(length);
    rand.nextBytes(randArray);
    return Buffer.from(randArray);
}
function equalConstTime(b1, b2) {
    if (b1.length !== b2.length) {
        return false;
    }
    var res = 0;
    for (var i = 0; i < b1.length; i++) {
        res |= b1[i] ^ b2[i]; // jshint ignore:line
    }
    return res === 0;
}
export class SecureError extends Error {}
export default class {
    #PublicKey: Buffer;
    #PrivateKey: Buffer;
    #hisPublicKey: Buffer;
    constructor(PrivateKey: Buffer, PublicKey: Buffer) {
        this.#PrivateKey = PrivateKey;
        this.#PublicKey = PublicKey;
    }
    async decrypt(ciphertext: Buffer, mac: Buffer, nonce: Buffer) {
        const key = blake.blake2b(
            secp256k1.getSharedSecret(this.#PrivateKey, this.#hisPublicKey),
            undefined,
            64
        );
        var decrypted = new JSChaCha20(key.subarray(0, 32), nonce, 0).decrypt(
            ciphertext
        );
        var contextMac = blake.blake2bInit(32, key.subarray(32));
        blake.blake2bUpdate(contextMac, nonce);
        blake.blake2bUpdate(contextMac, this.#hisPublicKey);
        blake.blake2bUpdate(contextMac, ciphertext);
        const realMac = blake.blake2bFinal(contextMac);
        if (!equalConstTime(mac, realMac)) {
            throw new SecureError("verify failed!!!");
        }
        return decrypted;
    }
    @injectable("encryptMessage")
    async encrypt(msg: Buffer) {
        const key = blake.blake2b(
            secp256k1.getSharedSecret(this.#PrivateKey, this.#hisPublicKey),
            undefined,
            64
        );
        const nonce = randomBytes(12);
        var encrypted = new JSChaCha20(key.subarray(0, 32), nonce, 0).encrypt(
            msg
        );
        var contextMac = blake.blake2bInit(32, key.subarray(32));
        blake.blake2bUpdate(contextMac, nonce);
        blake.blake2bUpdate(contextMac, this.#PublicKey);
        blake.blake2bUpdate(contextMac, encrypted);
        const mac = blake.blake2bFinal(contextMac);
        return {
            ciphertext: encrypted,
            mac: mac,
            nonce: nonce,
        };
    }
    async setHisPublicKey(signature, hisPublicKey, ephemPublicKey) {
        if (
            await sphincs.verifyDetached(
                signature,
                hisPublicKey,
                ephemPublicKey
            )
        ) {
            this.#hisPublicKey = hisPublicKey;
        } else {
            throw new SecureError("public key has been changed!!!");
        }
    }
    async exportPublicKey() {
        const { publicKey: ephemPublicKey, privateKey: ephemPrivateKey } =
            await sphincs.generateKeyPair();
        const signature = await sphincs.detached(
            this.#PublicKey,
            ephemPrivateKey
        );
        return {
            signature: signature,
            publicKey: this.#PublicKey,
            ephemPublicKey: ephemPublicKey,
        };
    }
}
