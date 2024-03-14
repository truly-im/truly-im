import showWhich from "../core/Utils/showWhich";
import { createUser } from "./account";

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
