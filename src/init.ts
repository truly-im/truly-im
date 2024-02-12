import "./elements"
import { checkUserExists } from "../src/account";
if (!checkUserExists() && !location.pathname.includes("welcome")) {
    location.pathname = "/welcome.html";
}