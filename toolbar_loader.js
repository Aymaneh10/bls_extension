console.log("[Toolbar Loader] Started");

// ========== 1) SAFE CLICK HANDLER (event delegation) ==========
// This ensures button clicks ALWAYS work even if BLS scripts crash.
document.addEventListener("click", (e) => {
    const id = e.target.id || (e.target.closest("button")?.id);
    if (!id) return;

    // Notify the button logic script (in /toolbar folder)
    if (window.__buttonCallbacks && window.__buttonCallbacks[id]) {
        try {
            window.__buttonCallbacks[id]();
        } catch (err) {
            console.error(`[Toolbar] Error executing callback for ${id}:`, err);
        }
    }
});

// Create registry object
window.__buttonCallbacks = {};


// ========== 2) GET NAVBAR ==========
function getNavbar() {
    return document.querySelector(".navbar") || document.querySelector("nav") || null;
}


// ========== 3) CREATE TOOLBAR DOM ==========
const toolbar = document.createElement("div");
toolbar.id = "bls-toolbar";
toolbar.style.cssText = `
    padding: 10px;
    display: flex;
    gap: 10px;
    background: #111;
    border-bottom: 1px solid #333;
    position: relative;
    z-index: 999999;
`;


// List of buttons
const buttonsList = [
    "PAGE_REFRESH",
    "TEST_BUTTON"
];


// Create button elements in toolbar
buttonsList.forEach(btn => {
    const el = document.createElement("button");
    el.id = `btn_${btn}`;
    el.textContent = btn.replace("_", " ");
    el.style.cssText = `
        padding: 8px 12px;
        background: #222;
        color: #fff;
        border-radius: 6px;
        border: 1px solid #555;
        cursor: pointer;
    `;
    toolbar.appendChild(el);
});


// ========== 4) INJECT TOOLBAR UNDER NAVBAR ==========

function injectToolbar() {
    const navbar = getNavbar();
    if (!navbar) {
        console.log("[Toolbar Loader] Navbar not found, retrying...");
        return setTimeout(injectToolbar, 400);
    }

    console.log("[Toolbar Loader] Navbar found, injecting toolbar!");
    navbar.insertAdjacentElement("afterend", toolbar);

    // Load button logic scripts
    loadButtons();
}

injectToolbar();


// ========== 5) LOAD BUTTON LOGIC FILES ==========

function loadButtons() {
    console.log("[Toolbar Loader] Loading button logic files...");

    buttonsList.forEach(btnName => {
        const file = `toolbar/${btnName}.js`;

        const script = document.createElement("script");
        script.type = "module";
        script.src = chrome.runtime.getURL(file);

        script.onload = () =>
            console.log(`[Toolbar Loader] Loaded: ${btnName}`);

        script.onerror = () =>
            console.error(`[Toolbar Loader] Failed to load: ${btnName}`);

        document.head.appendChild(script);
    });
}


// ========== 6) SAFE BUTTON REGISTRATION API ==========
// Each file in /toolbar can call:
//
// registerButton("PAGE_REFRESH", callback);
//
// This guarantees the callback fires EVERY TIME the button is clicked.

window.registerButton = function (name, callback) {
    const id = `btn_${name}`;
    window.__buttonCallbacks[id] = callback;

    console.log(`[Toolbar] Registered button logic for ${name}`);

    // Optional styling change after logic attaches
    const btn = document.getElementById(id);
    if (btn) btn.style.opacity = "1";
};
