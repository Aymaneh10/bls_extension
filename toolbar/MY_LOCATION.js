// MY_LOCATION.js
(function () {
    const bar = getToolbarContainer();
    if (!bar) return;

    const btn = document.createElement("button");
    btn.className = "toolbar-btn";
    btn.innerHTML = `<i class="fa-solid fa-location-dot"></i> Location`;

    btn.onclick = function () {
        console.log("[MY_LOCATION] Triggered");
        // 👉 WRITE YOUR LOGIC HERE
          function applyLocation(name) {
    const sel = document.querySelector('#location, select[name="location"], select[id*="location"]');
    if (sel) {
      let matched = false;
      Array.from(sel.options).forEach(opt=> {
        if (opt.text.toLowerCase().includes(name.toLowerCase())) { opt.selected = true; matched=true; }
      });
      sel.dispatchEvent(new Event('change', { bubbles: true }));
      alert(`MY_LOCATION: ${matched ? 'selected in page': 'no exact match in page select; saved default'}`);
    } else {
      alert('MY_LOCATION: no select found; saving default to localStorage');
      localStorage.setItem('bls_default_location', name);
    }
  }

  (function register(){
    const btn = makeButton();
    btn.addEventListener('click', ()=> {
      const def = localStorage.getItem('bls_default_location') || 'Casablanca';
      const name = prompt('Enter location to set', def) || def;
      applyLocation(name);
    });
    const tryReg = ()=>{ if(typeof window.registerToolbarButton === 'function'){ window.registerToolbarButton(btn); console.log(`[${MODULE}] registered`); return true;} return false; };
    if(!tryReg()){ const iv=setInterval(()=>{ if(tryReg()) clearInterval(iv); },250); setTimeout(()=>clearInterval(iv),8000); }
  })();
    };

    registerToolbarButton(btn);
})();
