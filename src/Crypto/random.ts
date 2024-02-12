import secureRandom from "../Utils/secure-random";
let rng = new secureRandom();
let randomSeed: number = 0;
export const seededRandom = function () {
    if (randomSeed == 0) {
        throw new Error("not generated yet");
    }
    let drift = (233280 * (1 + (rng.nextByte() / 255))), seed = randomSeed;
    seed = (seed * 9301 + 49297) % drift;
    let rnd = seed / drift;
    return rnd;

};
export async function generateSeed(dom: Window, progress: Function) {
    let mouseNums = 0, mouseMoveCount = 0;
    function getMove(e: MouseEvent) {
        mouseNums += Math.abs(e.movementX) + Math.abs(e.movementY);
        mouseMoveCount++;
    }
    dom.addEventListener("mousemove", getMove);
    dom.addEventListener("pointermove", getMove);
    let checkNumber: any;
    await new Promise((resolve) => {
        checkNumber = setInterval(() => {
            let check = mouseMoveCount / 256;
            progress(check);
            if (check > 1) {
                resolve(null);
            }
        }, 10);

    });
    clearInterval(checkNumber);
    dom.removeEventListener("mousemove", getMove);
    dom.removeEventListener("pointermove", getMove);
    randomSeed = mouseNums;
}