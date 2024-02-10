import { createPrivateKey } from "./crypto/generateKey";
import { generateSeed } from "./crypto/random"
await generateSeed(window, (progress: number) => {
    console.log("progress:", progress * 100, "%");
});
console.log("your private key:", createPrivateKey().toString("Hex"))