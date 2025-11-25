// COUNTDOWN_SESSION.js
(function () {
    const bar = getToolbarContainer();
    if (!bar) return;

    const btn = document.createElement("button");
    btn.className = "toolbar-btn";
    btn.innerHTML = `<i class="fa-solid fa-hourglass"></i> Session`;

    btn.onclick = function () {
        console.log("[COUNTDOWN_SESSION] Triggered");
        // 👉 WRITE YOUR LOGIC HERE
        let interval = null;
  let remaining = 0;
  let badge = null;

  function renderBadge(toolbar) {
    if (!badge) {
      badge = document.createElement('span');
      badge.style.cssText = 'background:#111;color:#fff;padding:6px 10px;border-radius:8px;font-family:monospace;font-weight:700';
      toolbar.appendChild(badge);
    }
    const mm = String(Math.floor(remaining/60)).padStart(2,'0'), ss = String(remaining%60).padStart(2,'0');
    badge.innerText = `${mm}:${ss}`;
  }

  function start(sec = 300, toolbar) {
    if (interval) return;
    remaining = sec;
    renderBadge(toolbar);
    interval = setInterval(()=> {
      remaining--;
      renderBadge(toolbar);
      if (remaining <= 0) {
        clearInterval(interval); interval=null;
        alert('COUNTDOWN finished');
      }
    }, 1000);
  }

  function stop() { if (interval) { clearInterval(interval); interval=null; if (badge) badge.remove(); badge=null; } }

  (function register(){
    const btn = makeButton();
    btn.addEventListener('click', () => {
      const toolbar = document.getElementById('bls-automation-toolbar');
      if (!interval) {
        const mins = parseInt(prompt('Countdown minutes', '5')||'5',10) || 5;
        start(mins*60, toolbar);
        btn.innerHTML = `${ICON}<span>COUNTDOWN ✓</span>`;
      } else {
        stop();
        btn.innerHTML = `${ICON}<span>COUNTDOWN</span>`;
      }
    });
    const tryReg = ()=>{ if(typeof window.registerToolbarButton === 'function'){ window.registerToolbarButton(btn); console.log(`[${MODULE}] registered`); return true;} return false; };
    if(!tryReg()){ const iv=setInterval(()=>{ if(tryReg()) clearInterval(iv); },250); setTimeout(()=>clearInterval(iv),8000); }
  })();
    };

    registerToolbarButton(btn);
})();
