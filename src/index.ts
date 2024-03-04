import { chacha20Transformer } from "./Crypto/chacha20";
import { blake2bSink } from "./Crypto/blake2";
import { createPrivateKey, isValidPrivateKey } from "./Crypto/generateKey";
import { base58_to_binary, binary_to_base58 } from "base58-js";
import { Buffer } from "buffer/";
import * as sphincs from "./Crypto/sphincs";
import * as eccrypto from "eccrypto";
const k = new Uint8Array(new Array<Number>(32).fill(114) as any),
    n = new Uint8Array(new Array<Number>(12).fill(51) as any);
(async () => {
    let c = "hello world!\n",
        c1 = 0;
    const stream = new ReadableStream({
        start(controller) {},
        pull(controller) {
            let string = new Uint8Array(Buffer.from([c.charCodeAt(c1++)]));
            controller.enqueue(string);
            if (c1 >= c.length) {
                controller.close();
            }
        },
        cancel() {},
    });

    // let trans = new TransformStream(new chacha20Transformer(k, n));
    // let [s1, s2] = stream.pipeThrough(trans).tee();
    // let reader = s1.getReader();
    // s2.pipeTo(
    //     new WritableStream(
    //         new blake2bSink(
    //             (aa) => {
    //                 console.log(aa);
    //             },
    //             32,
    //             k
    //         )
    //     )
    // );
    // let t1 = new chacha20Transformer(k, n);

    let { privateKey: p, publicKey: pr } = await sphincs.generateKeyPair();
    let reader = stream
        .pipeThrough(new sphincs.sphincsTransform({ privateKey: p }))
        .getReader();

    let a1 = "";
    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            break;
        }
        // t1.transform(value, {
        //     enqueue: (a) => {
        //         a1 += String.fromCharCode(...a);
        //     },
        // });
        console.log(value);
    }
    // console.log(a1);
})();
