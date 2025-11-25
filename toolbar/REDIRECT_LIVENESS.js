// REDIRECT_LIVENESS.js
(function () {
  const MODULE = "REDIRECT_LIVENESS";
  const ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 20a8 8 0 1 1 8-8h-2a6 6 0 1 0-6 6v2zm0-8l5-5 1.5 1.5L12 15l-3.5-3.5L10 10l2 2z"/></svg>`;

  function makeButton(){
    const btn = document.createElement('button');
    btn.className = 'bls-btn bls-liveness';
    btn.style.cssText = 'display:flex;align-items:center;gap:8px;background:#a78bfa;color:#000;border:none;padding:8px 12px;border-radius:8px;font-weight:700;cursor:pointer;';
    btn.innerHTML = `${ICON}<span>LIVENESS</span>`;
    return btn;
  }

  let pingInterval = null;

  async function ping(url) {
    try {
      const r = await fetch(url, { method: 'GET', cache: 'no-store' });
      return r.status;
    } catch (e) {
      return 0;
    }
  }

  function attach(btn) {
    btn.addEventListener('click', async () => {
      if (!pingInterval) {
        const url = prompt('Enter healthcheck URL (or leave blank for origin)', window.location.origin) || window.location.origin;
        const freq = parseInt(prompt('Ping interval ms', '5000')||'5000', 10) || 5000;
        pingInterval = setInterval(async () => {
          const status = await ping(url);
          console.log(`[${MODULE}] ping ${url} -> ${status}`);
          if (status === 0 || status >= 500) {
            alert(`LIVENESS: Non-OK status ${status} for ${url}`);
          }
        }, freq);
        btn.innerHTML = `${ICON}<span>LIVENESS ✓</span>`;
        alert('LIVENESS started');
      } else {
        clearInterval(pingInterval); pingInterval=null;
        btn.innerHTML = `${ICON}<span>LIVENESS</span>`;
        alert('LIVENESS stopped');
      }
    });
  }

  (function register(){
    const btn = makeButton();
    attach(btn);
    const tryReg = ()=>{ if(typeof window.registerToolbarButton === 'function'){ window.registerToolbarButton(btn); console.log(`[${MODULE}] registered`); return true;} return false; };
    if(!tryReg()){ const iv=setInterval(()=>{ if(tryReg()) clearInterval(iv); },250); setTimeout(()=>clearInterval(iv),8000); }
  })();
})();
