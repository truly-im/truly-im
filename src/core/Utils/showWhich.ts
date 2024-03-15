export default function showWhich(id: string) {
    let primaryEl = document.querySelector("#" + id);
    for (let el of primaryEl.parentElement.children) {
        if (el != primaryEl && (el as any).style != undefined) {
            (el as HTMLElement).style.display = "none";
        }
    }
    (primaryEl as any).style.display = "";
    window.location.hash = "#" + id;
}
if (window.location.hash != "") {
    showWhich(window.location.hash.replace("#", ""));
}
