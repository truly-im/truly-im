import { allComponents, provideFluentDesignSystem } from '@fluentui/web-components';
provideFluentDesignSystem().register(allComponents);
class bottomButtons extends HTMLElement {

    constructor() {
        super();
    }
    connectedCallback() {
        this.style.cssText += `position: absolute;
        bottom: var(--main-padding);
        text-align: right;
        left: var(--main-padding);
        right: var(--main-padding);`
    }
}
class loadingFullscreen extends HTMLElement {
    constructor() {
        super();
    }
    warpSpinner: HTMLDialogElement;
    connectedCallback() {
        this.warpSpinner = document.createElement("dialog");
        this.warpSpinner.style.cssText += `background: transparent;
border: 0;`
        const spinner = document.createElement('fluent-progress-ring');
        this.warpSpinner.appendChild(spinner);
        this.appendChild(this.warpSpinner)

    }
    show() {
        this.warpSpinner.showModal();
    }
    close() {
        this.warpSpinner.close();
    }
}
class backButton extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.onclick = () => {
            window.history.go(-1);
            window.onhashchange = () => {
                window.location.reload();
            }
        }
        const button = document.createElement("fluent-flipper");
        (button as any)._direction = "previous";
        this.appendChild(button);
        this.style.cssText += `padding: 1rem;padding-left:0;`
    }
}
customElements.define("bottom-buttons", bottomButtons);
customElements.define("loading-fullscreen", loadingFullscreen);
customElements.define("back-button", backButton);