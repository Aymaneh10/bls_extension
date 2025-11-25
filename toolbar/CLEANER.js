// CLEANER.js
(function () {
    const bar = getToolbarContainer();
    if (!bar) return;

    const btn = document.createElement("button");
    btn.className = "toolbar-btn";
    btn.innerHTML = `<i class="fa-solid fa-broom"></i> Clean`;

    btn.onclick = function () {
        console.log("[CLEANER] Triggered");
        // 👉 WRITE YOUR LOGIC HERE
         function clean() {
    // selectors to remove
    const selectors = [
      '.modal-backdrop', '.modal', '.overlay', '.loading', '.spinner', '.cookie-consent',
      '[role="dialog"]', '.popup', '.interstitial'
    ];
    let removed = 0;
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(n => { n.remove(); removed++; });
    });
    // remove inline blockers
    document.querySelectorAll('[style*="pointer-events: none"]').forEach(n=>{ n.style.pointerEvents='auto'; });
    document.documentElement.style.overflow = ''; document.body.style.overflow = '';
    // remove common inline no-scroll classes
    document.querySelectorAll('body.fixed, body.modal-open').forEach(n=> n.classList.remove('fixed','modal-open'));
    showSnackbar(`CLEANER: removed ${removed} elements`);
    console.log(`[${MODULE}] removed ${removed} elements`);
  }

  function showSnackbar(txt){
    let el = document.querySelector(".bls-snackbar");
    if (!el) { el = document.createElement("div"); el.className="bls-snackbar";
      el.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);bottom:28px;background:#111;color:#fff;padding:10px 14px;border-radius:8px;z-index:999999;opacity:0;transition:opacity .18s';
      document.body.appendChild(el);
    }
    el.innerText = txt; el.style.opacity="1"; setTimeout(()=>el.style.opacity="0",2200);
  }

  (function register(){
    const btn = makeButton();
    btn.addEventListener('click', ()=> { clean(); });
    const tryReg = ()=> { if(typeof window.registerToolbarButton === 'function'){ window.registerToolbarButton(btn); console.log(`[${MODULE}] registered`); return true;} return false; };
    if(!tryReg()){ const iv=setInterval(()=>{ if(tryReg()) clearInterval(iv); },250); setTimeout(()=>clearInterval(iv),8000); }
  })();
    };

    registerToolbarButton(btn);
})();