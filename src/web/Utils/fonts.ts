import WebFont from "webfontloader";
import notoLanguages from "./notoLanguages";
let languageList: any = null;
async function decideFont(lang: string, font: string): Promise<string[]> {
    return (notoLanguages.langToNotoFamilies[lang] as string[]).filter((l) =>
        l.includes(font)
    );
}
export async function loadDefaultFonts(languages: string[]) {
    let fontFamilys: string[] = [];
    for (let lang of languages) {
        fontFamilys.push(...(await decideFont(lang, "Noto Sans")));
    }
    let WebFontConfig: WebFont.Config = {
        google: {
            families: fontFamilys,
        },
    };
    WebFont.load(WebFontConfig);
    return fontFamilys;
}
