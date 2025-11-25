// PAGE_REDIRECTOR.js
(function () {
  const MODULE = "PAGE_REDIRECTOR";
  const ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l1.41 1.41L8.83 10H20v2H8.83l4.58 4.59L12 18l-8-8z"/></svg>`;

  function makeButton(){
    const btn = document.createElement('button');
    btn.className = 'bls-btn bls-redirect';
    btn.style.cssText = 'display:flex;align-items:center;gap:8px;background:#fb7185;color:#fff;border:none;padding:8px 12px;border-radius:8px;font-weight:700;cursor:pointer;';
    btn.innerHTML = `${ICON}<span>REDIRECT</span>`;
    return btn;
  }

  function scheduleRedirect(url, delay) {
    setTimeout(()=>{ window.location.href = url; }, delay);
    alert(`Redirect scheduled in ${delay/1000}s to ${url}`);
  }

  (function register(){
    const btn = makeButton();
    btn.addEventListener('click', ()=> {
      const url = prompt('Enter absolute URL to redirect to', window.location.href);
      if (!url) return;
      const mode = prompt('Type: now | schedule (ms)', 'now');
      if (mode === 'now') window.location.href = url;
      else {
        const ms = parseInt(prompt('Delay in ms', '5000')||'5000',10) || 5000;
        scheduleRedirect(url, ms);
      }
    });
    const tryReg = ()=>{ if(typeof window.registerToolbarButton === 'function'){ window.registerToolbarButton(btn); console.log(`[${MODULE}] registered`); return true;} return false; };
    if(!tryReg()){ const iv=setInterval(()=>{ if(tryReg()) clearInterval(iv); },250); setTimeout(()=>clearInterval(iv),8000); }
  })();
})();
