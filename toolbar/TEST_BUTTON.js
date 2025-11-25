console.log("[TEST_BUTTON] Loaded");

function attachTestButton() {
    const btn = document.getElementById("btn_TEST_BUTTON");

    if (!btn) {
        console.warn("[TEST_BUTTON] Button not found yet. Retrying...");
        return setTimeout(attachTestButton, 300);
    }

    console.log("[TEST_BUTTON] Button found. Activating...");

    btn.addEventListener("click", () => {
        alert("TEST BUTTON CLICKED!");
        console.log("TEST BUTTON CLICKED!");
    });
}

attachTestButton();
