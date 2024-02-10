let randomSeed: number = 0;
export const seededRandom = function () {
    if (randomSeed == 0) {
        throw new Error("not generated yet");
    }
    let drift = (233280 * (1 + Math.random())), seed = randomSeed;
    seed = (seed * 9301 + 49297) % drift;
    let rnd = seed / drift;
    return rnd;

};
function checkSeeds(seed: number) {
    return seed / 256;
}
export async function generateSeed(dom: Window, progress: Function) {
    let mouseNums = 0;
    interface XY {
        clientX: number;
        clientY: number;
    };
    let maxX = dom.innerWidth, maxY = dom.innerHeight;
    function getMove(e: XY) {
        mouseNums += e.clientX / maxX + e.clientY / maxY;
    }
    function getTouchMove(e: TouchEvent) {
        for (let point of e.touches) {
            getMove(point);
        }
    }
    dom.addEventListener("mousemove", getMove);
    dom.addEventListener("touchmove", getTouchMove);
    dom.addEventListener("pointermove", getMove);
    let checkNumber: any;
    await new Promise((resolve) => {
        checkNumber = setInterval(() => {
            let check = checkSeeds(mouseNums)
            progress(check);
            if (check > 1) {
                resolve(null);
            }
        }, 10);

    });
    clearInterval(checkNumber);
    dom.removeEventListener("mousemove", getMove);
    dom.removeEventListener("touchmove", getTouchMove);
    dom.removeEventListener("pointermove", getMove);
    randomSeed = mouseNums;
}