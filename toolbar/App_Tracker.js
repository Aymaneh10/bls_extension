// App_Tracker.js
(function () {
    const bar = window.getToolbarContainer();
    if (!bar) return;

    const btn = document.createElement("button");
    btn.className = "toolbar-btn";
    btn.innerHTML = `<i class="fa-solid fa-bullseye"></i> Tracker`;

    btn.onclick = function () {
        console.log("[APP_TRACKER] Triggered");
        // 👉 WRITE YOUR LOGIC HERE
        let observer = null;

  function scanAndReport() {
    // site-specific heuristics: count table rows, .slot elements and visible buttons
    const tableRows = document.querySelectorAll("table tr").length;
    const slotEls = document.querySelectorAll(".slot, .appointment-row, .slot-row").length;
    const avail = Array.from(document.body.querySelectorAll("*")).filter(n => /available|slots available|book now/i.test(n.innerText)).length;
    console.log(`[${MODULE}] rows=${tableRows} slots=${slotEls} availMatches=${avail}`);
    showSnackbar(`Rows:${tableRows} Slots:${slotEls} Matches:${avail}`);
  }

  function observeChanges() {
    if (observer) return;
    observer = new MutationObserver((mutations) => {
      // on significant change run scan
      scanAndReport();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    console.log(`[${MODULE}] mutation observer started`);
  }

  function showSnackbar(txt){
    let el = document.querySelector(".bls-snackbar");
    if (!el) { el = document.createElement("div"); el.className="bls-snackbar";
      el.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);bottom:28px;background:#111;color:#fff;padding:10px 14px;border-radius:8px;z-index:999999;opacity:0;transition:opacity .18s';
      document.body.appendChild(el);
    }
    el.innerText = txt; el.style.opacity="1"; setTimeout(()=>el.style.opacity="0", 2200);
  }

  function attach(btn) {
    let running = false;
    btn.addEventListener("click", () => {
      if (!running) {
        scanAndReport();
        observeChanges();
        running = true;
        btn.innerHTML = `${ICON}<span>APP TRACKER ✓</span>`;
      } else {
        if (observer) { observer.disconnect(); observer = null; }
        running = false;
        btn.innerHTML = `${ICON}<span>APP TRACKER</span>`;
        showSnackbar("App Tracker stopped");
      }
    });
  }

  (function register(){
    const btn = makeButton();
    attach(btn);
    const tryReg = () => {
      if (typeof window.registerToolbarButton === "function") { window.registerToolbarButton(btn); console.log(`[${MODULE}] registered`); return true; }
      return false;
    };
    if (!tryReg()) { const iv=setInterval(()=>{ if(tryReg()) clearInterval(iv); },250); setTimeout(()=>clearInterval(iv),8000); }
  })();
    };

    window.registerToolbarButton(btn);
})();
