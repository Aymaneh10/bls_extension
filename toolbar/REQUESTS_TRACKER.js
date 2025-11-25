// REQUESTS_TRACKER.js
(function () {
  const MODULE = "REQUESTS_TRACKER";
  const ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l9 4.9v8.2L12 21 3 16.1V7.9z"/></svg>`;

  function makeButton(){
    const btn = document.createElement('button');
    btn.className = 'bls-btn bls-requests';
    btn.style.cssText = 'display:flex;align-items:center;gap:8px;background:#fb923c;color:#000;border:none;padding:8px 12px;border-radius:8px;font-weight:700;cursor:pointer;';
    btn.innerHTML = `${ICON}<span>REQUESTS</span>`;
    return btn;
  }

  if (!window.__BLS_REQUESTS_LOG) {
    window.__BLS_REQUESTS_LOG = [];
    (function installHooks(){
      const origFetch = window.fetch;
      window.fetch = async function(...args){
        const start = performance.now();
        try {
          const res = await origFetch.apply(this, args);
          const time = performance.now() - start;
          window.__BLS_REQUESTS_LOG.push({type:'fetch', url: args[0], status: res.status, time, ts: Date.now()});
          return res;
        } catch (e) {
          window.__BLS_REQUESTS_LOG.push({type:'fetch', url: args[0], error: String(e), ts: Date.now()});
          throw e;
        }
      };
      const origOpen = XMLHttpRequest.prototype.open;
      const origSend = XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.open = function(method, url){
        this.__bls_req = {method, url, start: null};
        return origOpen.apply(this, arguments);
      };
      XMLHttpRequest.prototype.send = function(body){
        this.__bls_req.start = performance.now();
        this.addEventListener('loadend', ()=> {
          const t = performance.now() - this.__bls_req.start;
          window.__BLS_REQUESTS_LOG.push({type:'xhr', url:this.__bls_req.url, status:this.status, time:t, ts: Date.now()});
        });
        return origSend.apply(this, arguments);
      };
      console.log('[REQUESTS_TRACKER] hooks installed');
    })();
  }

  function attach(btn) {
    btn.addEventListener('click', ()=> {
      const list = window.__BLS_REQUESTS_LOG.slice(-50).reverse();
      console.table(list);
      alert(`REQUESTS_TRACKER: logged ${window.__BLS_REQUESTS_LOG.length} requests (see console)`);
    });
  }

  (function register(){
    const btn = makeButton();
    attach(btn);
    const tryReg = ()=>{ if(typeof window.registerToolbarButton === 'function'){ window.registerToolbarButton(btn); console.log(`[${MODULE}] registered`); return true;} return false; };
    if(!tryReg()){ const iv=setInterval(()=>{ if(tryReg()) clearInterval(iv); },250); setTimeout(()=>clearInterval(iv),8000); }
  })();
})();
