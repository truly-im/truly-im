import "./elements";
import { checkUserExists } from "./account";
import { loadDefaultFonts } from "./Utils/fonts";
if (!checkUserExists() && !location.pathname.includes("welcome")) {
    location.pathname = "/welcome.html";
}
(async () => {
    let fonts = await loadDefaultFonts(["zh_Hans"]);
    fonts.push("sans-serif"); //as a fallback
    document.body.style.fontFamily = fonts.map((f) => "'" + f + "'").join(",");
})();
