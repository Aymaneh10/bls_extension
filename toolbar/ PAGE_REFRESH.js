console.log("[PAGE_REFRESH] Loaded");

function init() {
    registerButton("PAGE_REFRESH", () => {
        console.log("PAGE REFRESH CLICKED!");
        alert("Page refresh logic activated!");
    });
}

init();
