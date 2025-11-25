// IP_ROTATION_ERROR.js
(function () {
    const bar = getToolbarContainer();
    if (!bar) return;

    const btn = document.createElement("button");
    btn.className = "toolbar-btn";
    btn.innerHTML = `<i class="fa-solid fa-network-wired"></i> IP Error`;

    btn.onclick = function () {
        console.log("[IP_ROTATION_ERROR] Triggered");
        // 👉 WRITE YOUR LOGIC HERE
        function scanForIpErrors() {
    const text = document.body.innerText || "";
    const patterns = [/rate limit/i, /too many requests/i, /403|forbidden/i, /blocked/i, /bad gateway/i];
    const matched = patterns.some(p => p.test(text));
    if (matched) {
      alert('IP_ROTATION_ERROR: Detected potential rate limiting or blocking text on page. Consider rotating IP/proxy.');
    } else {
      alert('IP_ROTATION_ERROR: No obvious IP block text detected.');
    }
  }

  (function register(){
    const btn = makeButton();
    btn.addEventListener('click', scanForIpErrors);
    const tryReg = ()=>{ if(typeof window.registerToolbarButton === 'function'){ window.registerToolbarButton(btn); console.log(`[${MODULE}] registered`); return true;} return false; };
    if(!tryReg()){ const iv=setInterval(()=>{ if(tryReg()) clearInterval(iv); },250); setTimeout(()=>clearInterval(iv),8000); }
  })();
    };

    registerToolbarButton(btn);
})();