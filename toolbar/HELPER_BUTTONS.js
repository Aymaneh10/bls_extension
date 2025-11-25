// helper_button.js

export function createContainer() {
    const div = document.createElement("div");
    div.id = "my-toolbar-container";

    Object.assign(div.style, {
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: "9999999",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        background: "rgba(20,20,20,0.9)",
        padding: "10px",
        borderRadius: "10px",
        boxShadow: "0 4px 18px rgba(0,0,0,0.4)"
    });

    return div;
}

// BASE button template
function baseButton(id, text) {
    const btn = document.createElement("button");
    btn.id = id;
    btn.innerText = text;

    Object.assign(btn.style, {
        padding: "8px 12px",
        fontFamily: "Arial",
        fontSize: "14px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        transition: "0.2s"
    });

    return btn;
}

// ---- Button UI definitions (1 per button) ----

export function UI_REFRESH() {
    const btn = baseButton("btn_refresh", "Refresh");
    btn.style.background = "#007bff";
    btn.style.color = "white";
    return btn;
}

export function UI_DARKMODE() {
    const btn = baseButton("btn_darkmode", "Dark Mode");
    btn.style.background = "#222";
    btn.style.color = "white";
    return btn;
}

export function UI_SCROLLTOP() {
    const btn = baseButton("btn_scrolltop", "Top");
    btn.style.background = "#28a745";
    btn.style.color = "white";
    return btn;
}

// Add more UI functions here...
