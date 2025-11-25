// SLOT_NOTIFICATION.js
(function () {
  const MODULE = "SLOT_NOTIFICATION";
  const ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l1.41 1.41L8.83 10H20v2H8.83l4.58 4.59L12 18l-8-8z"/></svg>`;

  function makeButton(){
    const btn = document.createElement('button');
    btn.className = 'bls-btn bls-slot';
    btn.style.cssText = 'display:flex;align-items:center;gap:8px;background:#06b6d4;color:#000;border:none;padding:8px 12px;border-radius:8px;font-weight:700;cursor:pointer;';
    btn.innerHTML = `${ICON}<span>SLOT NOTIF</span>`;
    return btn;
  }

  let pollId = null;

  function startPolling(interval = 5000) {
    if (pollId) return;
    pollId = setInterval(()=> {
      const text = (document.body && document.body.innerText || '').toLowerCase();
      if (text.includes('available') || text.includes('slots available') || text.includes('book now')) {
        alert('SLOT_NOTIFICATION: possible slot detected! Check page.');
        try { new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=').play(); } catch(e){}
        clearInterval(pollId); pollId = null;
      }
    }, interval);
    alert('SLOT_NOTIFICATION: polling started');
  }

  function stopPolling() {
    if (pollId) { clearInterval(pollId); pollId = null; alert('SLOT_NOTIFICATION: polling stopped'); } else alert('SLOT_NOTIFICATION: not running');
  }

  (function register(){
    const btn = makeButton();
    let running = false;
    btn.addEventListener('click', ()=> {
      if (!running) { startPolling(5000); running = true; btn.innerHTML = `${ICON}<span>SLOT NOTIF ✓</span>`; }
      else { stopPolling(); running=false; btn.innerHTML = `${ICON}<span>SLOT NOTIF</span>`; }
    });

    const tryReg = ()=>{ if(typeof window.registerToolbarButton === 'function'){ window.registerToolbarButton(btn); console.log(`[${MODULE}] registered`); return true;} return false; };
    if(!tryReg()){ const iv=setInterval(()=>{ if(tryReg()) clearInterval(iv); },250); setTimeout(()=>clearInterval(iv),8000); }
  })();
})();
