// SNAKBAR.js
(function () {
  const MODULE = "SNAKBAR";
  const ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M2 3h20v14H6l-4 4V3z"/></svg>`;

  function makeButton(){
    const btn = document.createElement('button');
    btn.className = 'bls-btn bls-snackbar';
    btn.style.cssText = 'display:flex;align-items:center;gap:8px;background:#111827;color:#fff;border:none;padding:8px 12px;border-radius:8px;font-weight:700;cursor:pointer;';
    btn.innerHTML = `${ICON}<span>SNACKBAR</span>`;
    return btn;
  }

  function showSnackbar(text, duration=3000) {
    let el = document.querySelector('.bls-snackbar-el');
    if (!el) {
      el = document.createElement('div');
      el.className = 'bls-snackbar-el';
      el.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);bottom:28px;background:#111;color:#fff;padding:10px 14px;border-radius:8px;z-index:999999;opacity:0;transition:opacity .18s';
      document.body.appendChild(el);
    }
    el.innerText = text;
    el.style.opacity = '1';
    setTimeout(()=> el.style.opacity='0', duration);
  }

  (function register(){
    const btn = makeButton();
    btn.addEventListener('click', ()=> showSnackbar('This is a snackbar message', 3000));
    // expose helper globally for other modules
    window.BLS_ShowSnackbar = showSnackbar;
    const tryReg = ()=>{ if(typeof window.registerToolbarButton === 'function'){ window.registerToolbarButton(btn); console.log(`[${MODULE}] registered`); return true;} return false; };
    if(!tryReg()){ const iv=setInterval(()=>{ if(tryReg()) clearInterval(iv); },250); setTimeout(()=>clearInterval(iv),8000); }
  })();
})();
