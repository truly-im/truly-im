import { Blake2bCTX, blake2bInit, blake2bUpdate, blake2bFinal } from "blakejs";
export class blake2bSink implements UnderlyingSink {
    #blake: Blake2bCTX;
    callback: (hash: any) => void;
    constructor(callback: (hash) => void, outlen?: number, key?: Uint8Array) {
        this.#blake = blake2bInit(outlen, key);
        this.callback = callback;
    }
    write(chunk) {
        blake2bUpdate(this.#blake, chunk);
    }
    close() {
        this.callback(blake2bFinal(this.#blake));
    }
}
