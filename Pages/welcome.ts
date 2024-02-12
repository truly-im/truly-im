
import { createPrivateKey, isValidPrivateKey } from "../src/Crypto/generateKey";
import { generateSeed, seededRandom } from "../src/Crypto/random";
import { base58_to_binary, binary_to_base58 } from "base58-js"
import { Buffer } from "buffer/"
import * as eccrypto from "eccrypto";
import cryptoMessage from "../src/Crypto/cryptoMessage";
import IMG15 from "/src/img.bmp?url";
import * as sphincs from "../src/Crypto/sphincs"
let t: number;
function getTime() {
    t = new Date().getTime();
}
function getTimeEnd() {
    return new Date().getTime() - t;
}
(async () => {
    (document.getElementById("inputKey") as any).value = '';
    let value = new Uint8Array(await (await fetch(IMG15)).arrayBuffer());
    let length = value.length;
    await generateSeed(window, (progress: number) => {
        console.log("progress:", Math.floor(progress * 100), "%");
    });
    // let privateKey = createPrivateKey();
    // (document.getElementById("inputKey") as any).value = outputHex(privateKey);
    // let privateKey: Buffer | null = null;


    // let { publicKey, privateKey } = await sphincs.generateKeyPair();
    // console.time("encrypt");
    // let msg1 = await sphincs.sign(value, privateKey);
    // console.timeEnd("encrypt");
    // console.time("decrypt");
    // let msg2 = await sphincs.verify(msg1, publicKey);
    // console.timeEnd("decrypt");
    // console.log(msg, msg1, Buffer.from(msg2).toString('utf-8'))


    await new Promise((resolve) => {
        document.getElementById("submitKey").onclick = () => {
            // if (privateKey == null) {
            //     privateKey = parseHex((document.getElementById("inputKey") as any).value);
            //     localStorage.setItem("privateKey", (document.getElementById("inputKey") as any).value)
            // }
            resolve(null);
        }
    });
    const privateKey = createPrivateKey();
    (document.getElementById("inputKey") as any).value = binary_to_base58(privateKey)
    const privateKey2 = createPrivateKey();
    var publicKey = eccrypto.getPublic(privateKey as any), publicKey2 = eccrypto.getPublic(privateKey2 as any);
    let msg = new cryptoMessage(privateKey, publicKey), msg2 = new cryptoMessage(privateKey2, publicKey2);
    getTime();
    let public1 = await msg.exportPublicKey();
    let t1 = getTimeEnd();
    let public2 = await msg2.exportPublicKey();
    getTime();
    await msg.setHisPublicKey(public2.signature, public2.publicKey, public2.ephemPublicKey);
    let t2 = getTimeEnd();
    await msg2.setHisPublicKey(public1.signature, public1.publicKey, public1.ephemPublicKey);
    console.log("getPublicKey:", t1 / 1000, "s", "setPublicKey:", t2 / 1000, "s")
    getTime();
    let msgOutput = await msg.encrypt(value);
    t1 = getTimeEnd();
    getTime();
    let msg2Output = await msg2.decrypt(msgOutput.ciphertext, msgOutput.mac, msgOutput.nonce);
    t2 = getTimeEnd();
    console.log("encrypt:", (length / 1000000) / (t1 / 1000), "Mb/s", "decrypt:", (length / 1000000) / (t2 / 1000), "Mb/s")
    document.body.innerHTML += `<img style="width:100%;position:absolute;top: 0;left: 0;" src="${URL.createObjectURL(new Blob([msg2Output]))}"></img>`;
    // console.log(URL.createObjectURL(new Blob([msg2Output])))

})();