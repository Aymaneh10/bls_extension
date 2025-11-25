// toolbar_helper.js

// Create DOM elements using template string
export function createElement(html) {
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return template.content.firstElementChild;
}

// Inject CSS inside shadow
export function loadCSS(shadowRoot, cssContent) {
    const style = document.createElement("style");
    style.textContent = cssContent;
    shadowRoot.appendChild(style);
}

// Auto-load all JS button files inside /toolbar/
export async function loadButtonScripts(buttonContainer) {
    const files = [
        "TEST_BUTTON.js"
        // add more if needed
    ];

    for (const file of files) {
        const module = await import(chrome.runtime.getURL("toolbar/" + file));

        const button = document.createElement("button");
        button.textContent = module.buttonLabel;

        button.addEventListener("click", module.buttonAction);

        buttonContainer.appendChild(button);
    }
}
