// ENABLE_COPY_PASTE.js
(function () {
    const bar = getToolbarContainer();
    if (!bar) return;

    const btn = document.createElement("button");
    btn.className = "toolbar-btn";
    btn.innerHTML = `<i class="fa-solid fa-clipboard"></i> Copy/Paste`;

    btn.onclick = function () {
        console.log("[ENABLE_COPY_PASTE] Triggered");
        // 👉 WRITE YOUR LOGIC HERE
        function enable() {
    // remove inline event blockers and attributes
    document.querySelectorAll('input,textarea,[contenteditable]').forEach(el => {
      try {
        el.onpaste = null; el.oncopy = null; el.oncut = null;
        el.removeAttribute('onpaste'); el.removeAttribute('oncopy'); el.removeAttribute('oncut');
      } catch(e){}
    });
    // also remove global listeners that cancel copy/paste — best-effort: clone & replace elements with same attributes (keeps value)
    document.querySelectorAll('input,textarea').forEach(el=>{
      const clone = el.cloneNode(true);
      try { el.parentNode.replaceChild(clone, el); } catch(e) {}
    });
    alert('ENABLE_COPY_PASTE: attempts made to enable copy/paste');
  }

  (function register(){
    const btn = makeButton();
    btn.addEventListener('click', enable);
    const tryReg = ()=>{ if(typeof window.registerToolbarButton === 'function'){ window.registerToolbarButton(btn); console.log(`[${MODULE}] registered`); return true;} return false; };
    if(!tryReg()){ const iv=setInterval(()=>{ if(tryReg()) clearInterval(iv); },250); setTimeout(()=>clearInterval(iv),8000); }
  })();
    };

    registerToolbarButton(btn);
})();
