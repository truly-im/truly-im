import { createPrivateKey, isValidPrivateKey } from "./Crypto/generateKey";
import { base58_to_binary, binary_to_base58 } from "base58-js";
import { Buffer } from "buffer/";
import * as eccrypto from "eccrypto";
import cryptoMessage from "./Crypto/cryptoMessage";
import * as sphincs from "./Crypto/sphincs";
import showWhich from "./Utils/showWhich";
import { createUser } from "./account";
(async () => {
    // await generateSeed(window, (progress: number) => {
    //     console.log("progress:", Math.floor(progress * 100), "%");
    // });
    // const privateKey = createPrivateKey();
    // const privateKey2 = createPrivateKey();
    // var publicKey = eccrypto.getPublic(privateKey as any), publicKey2 = eccrypto.getPublic(privateKey2 as any);
    // let msg = new cryptoMessage(privateKey, publicKey), msg2 = new cryptoMessage(privateKey2, publicKey2);
    // let public1 = await msg.exportPublicKey();
    // let public2 = await msg2.exportPublicKey();
    // await msg.setHisPublicKey(public2.signature, public2.publicKey, public2.ephemPublicKey);
    // await msg2.setHisPublicKey(public1.signature, public1.publicKey, public1.ephemPublicKey);
    // let msgOutput = await msg.encrypt("value");
    // let msg2Output = await msg2.decrypt(msgOutput.ciphertext, msgOutput.mac, msgOutput.nonce);
})();
async function initTruly(newUser: boolean, userName) {
    createUser(userName);
    location.href = "/" + (newUser ? "#newUser" : "");
}
const showLoading = document.getElementById("show-loading") as any;
globalThis.nextStep = async function (step) {
    showLoading.show();
    switch (step) {
        case "sign-in":
            showWhich("sign-in-page");
            break;
        case "sign-up":
            showWhich("sign-up-page");
            break;
        case "submit-sign-in":
            await initTruly(
                false,
                (document.getElementById("input-username-sign-in") as any).value
            );
            break;
        case "submit-sign-up":
            await initTruly(
                true,
                (document.getElementById("input-username-sign-in") as any).value
            );
            break;
        case "problems":
            location.href = "https://github.com/cheese233/truly-im";
            break;
        default:
            throw new Error();
            break;
    }
    showLoading.close();
};
