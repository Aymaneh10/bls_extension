// MANAGE_APP.js
(function () {
    const bar = getToolbarContainer();
    if (!bar) return;

    const btn = document.createElement("button");
    btn.className = "toolbar-btn";
    btn.innerHTML = `<i class="fa-solid fa-folder-open"></i> Manage`;

    btn.onclick = function () {
        console.log("[MANAGE_APP] Triggered");
        // 👉 WRITE YOUR LOGIC HERE
          function scanAppointments() {
    const rows = Array.from(document.querySelectorAll('table tr')).map(tr => tr.innerText.trim()).filter(Boolean);
    console.log('[MANAGE_APP] rows', rows.slice(0,40));
    alert(`MANAGE_APP: found ${rows.length} table rows (see console)`);
  }

  function exportCSV() {
    const rows = Array.from(document.querySelectorAll('table tr')).map(tr => Array.from(tr.querySelectorAll('td,th')).map(td=>td.innerText.trim()).join(','));
    if (!rows.length) { alert('No table rows found to export'); return; }
    const csv = rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'appointments.csv'; a.click(); URL.revokeObjectURL(url);
    alert('MANAGE_APP: exported CSV (download started)');
  }

  // destructive simulation: remove first matching appointment by text
  function removeFirstMatch(needle) {
    const rows = document.querySelectorAll('table tr');
    for (const r of rows) {
      if (r.innerText.toLowerCase().includes(needle.toLowerCase())) {
        r.remove();
        alert('MANAGE_APP: removed first matching row (DOM only)');
        return;
      }
    }
    alert('MANAGE_APP: no match found');
  }

  (function register(){
    const btn = makeButton();
    btn.addEventListener('click', async ()=> {
      const action = prompt('MANAGE_APP action: [scan|export|remove]','scan');
      if (action === 'scan') scanAppointments();
      else if (action === 'export') exportCSV();
      else if (action === 'remove') {
        const q = prompt('Text to match and remove (DOM only):','example');
        if (q) removeFirstMatch(q);
      } else alert('Unknown action');
    });
    const tryReg = ()=>{ if(typeof window.registerToolbarButton === 'function'){ window.registerToolbarButton(btn); console.log(`[${MODULE}] registered`); return true;} return false; };
    if(!tryReg()){ const iv=setInterval(()=>{ if(tryReg()) clearInterval(iv); },250); setTimeout(()=>clearInterval(iv),8000); }
  })();
    };

    registerToolbarButton(btn);
})();



