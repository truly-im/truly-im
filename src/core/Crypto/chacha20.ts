export class chacha20Transformer implements Transformer {
    _rounds = 20;
    _sigma = [0x61707865, 0x3320646e, 0x79622d32, 0x6b206574];
    _param: number[];
    _keystream = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ];
    _byteCounter = 0;
    constructor(key: Uint8Array, nonce: Uint8Array, counter?: number) {
        if (typeof counter === "undefined") {
            counter = 0;
        }

        if (!(key instanceof Uint8Array) || key.length !== 32) {
            throw new Error("Key should be 32 byte array!");
        }

        if (!(nonce instanceof Uint8Array) || nonce.length !== 12) {
            throw new Error("Nonce should be 12 byte array!");
        }

        // param construction
        this._param = [
            this._sigma[0],
            this._sigma[1],
            this._sigma[2],
            this._sigma[3],
            // key
            this._get32(key, 0),
            this._get32(key, 4),
            this._get32(key, 8),
            this._get32(key, 12),
            this._get32(key, 16),
            this._get32(key, 20),
            this._get32(key, 24),
            this._get32(key, 28),
            // counter
            counter,
            // nonce
            this._get32(nonce, 0),
            this._get32(nonce, 4),
            this._get32(nonce, 8),
        ];
    }
    start() {}
    transform(chunk, controller) {
        controller.enqueue(this._update(chunk));
    }
    _chacha() {
        var mix = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var i = 0;
        var b = 0;

        // copy param array to mix //
        for (i = 0; i < 16; i++) {
            mix[i] = this._param[i];
        }

        // mix rounds //
        for (i = 0; i < this._rounds; i += 2) {
            this._quarterround(mix, 0, 4, 8, 12);
            this._quarterround(mix, 1, 5, 9, 13);
            this._quarterround(mix, 2, 6, 10, 14);
            this._quarterround(mix, 3, 7, 11, 15);

            this._quarterround(mix, 0, 5, 10, 15);
            this._quarterround(mix, 1, 6, 11, 12);
            this._quarterround(mix, 2, 7, 8, 13);
            this._quarterround(mix, 3, 4, 9, 14);
        }

        for (i = 0; i < 16; i++) {
            // add
            mix[i] += this._param[i];

            // store keystream
            this._keystream[b++] = mix[i] & 0xff;
            this._keystream[b++] = (mix[i] >>> 8) & 0xff;
            this._keystream[b++] = (mix[i] >>> 16) & 0xff;
            this._keystream[b++] = (mix[i] >>> 24) & 0xff;
        }
    }

    /**
     * The basic operation of the ChaCha algorithm is the quarter round.
     * It operates on four 32-bit unsigned integers, denoted a, b, c, and d.
     */
    _quarterround(
        output: Array<any>,
        a: number,
        b: number,
        c: number,
        d: number
    ) {
        output[d] = this._rotl(output[d] ^ (output[a] += output[b]), 16);
        output[b] = this._rotl(output[b] ^ (output[c] += output[d]), 12);
        output[d] = this._rotl(output[d] ^ (output[a] += output[b]), 8);
        output[b] = this._rotl(output[b] ^ (output[c] += output[d]), 7);

        // JavaScript hack to make UINT32 :) //
        output[a] >>>= 0;
        output[b] >>>= 0;
        output[c] >>>= 0;
        output[d] >>>= 0;
    }

    /**
     * Little-endian to uint 32 bytes
     */
    _get32(data: Uint8Array | [number], index: number): number {
        return (
            data[index++] ^
            (data[index++] << 8) ^
            (data[index++] << 16) ^
            (data[index] << 24)
        );
    }

    /**
     * Cyclic left rotation
     */
    _rotl(data: number, shift: number): number {
        return (data << shift) | (data >>> (32 - shift));
    }
    /**
     *  Encrypt or Decrypt data with key and nonce
     */
    _update(data: Uint8Array): Uint8Array {
        if (!(data instanceof Uint8Array) || data.length === 0) {
            throw new Error(
                "Data should be type of bytes (Uint8Array) and not empty!"
            );
        }

        var output = new Uint8Array(data.length);
        // core function, build block and xor with input data //
        for (var i = 0; i < data.length; i++) {
            if (this._byteCounter === 0 || this._byteCounter === 64) {
                // generate new block //

                this._chacha();
                // counter increment //
                this._param[12]++;

                // reset internal counter //
                this._byteCounter = 0;
            }

            output[i] = data[i] ^ this._keystream[this._byteCounter++];
        }

        return output;
    }
}
