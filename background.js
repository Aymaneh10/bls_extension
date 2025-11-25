// background.js

// 1. الحفاظ على الاتصال (Keep-Alive / Heartbeat)
chrome.runtime.onConnect.addListener((port) => {
    if (port.name === "content-script-heartbeat") {
        port.onMessage.addListener((msg) => {
            if (msg.type === "HEARTBEAT_PING") {
                port.postMessage({ type: "HEARTBEAT_PONG" });
            }
        });
    }
});

// 2. معالجة الرسائل العامة
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    
    // مجرد رد بسيط لضمان عدم تعليق الرسائل
    if (request.action === "injectExternalScript") {
        // في النظام المحلي، لن نحتاج لهذا، ولكن نضع رداً وهمياً لمنع الأخطاء
        sendResponse({ success: false, message: "External injection disabled in local mode" });
    }

    // تمرير رسائل البدء والإيقاف (اختياري، لأننا نرسلها مباشرة للتاب النشط أحياناً)
    if (request.action === "START_SCRIPT" || request.action === "STOP_SCRIPT") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, request);
            }
        });
        sendResponse({ success: true });
    }
});