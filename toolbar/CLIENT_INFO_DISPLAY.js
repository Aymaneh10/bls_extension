// CLIENT_INFO_DISPLAY.js
(function () {
    const bar = getToolbarContainer();
    if (!bar) return;

    const btn = document.createElement("button");
    btn.className = "toolbar-btn";
    btn.innerHTML = `<i class="fa-solid fa-user"></i> Client`;

    btn.onclick = function () {
        console.log("[CLIENT_INFO_DISPLAY] Triggered");
        // 👉 WRITE YOUR LOGIC HERE
         function openPanel(client) {
    let panel = document.getElementById('bls-client-panel');
    if (panel) { panel.remove(); return; }
    panel = document.createElement('div');
    panel.id = 'bls-client-panel';
    panel.style.cssText = 'position:fixed;right:12px;top:80px;background:#fff;color:#000;padding:12px;border-radius:8px;box-shadow:0 8px 30px rgba(0,0,0,.12);z-index:999999;width:320px';
    panel.innerHTML = `
      <h4 style="margin:0 0 8px">Client Info</h4>
      <div><strong>Name:</strong> <span id="ci-name">${client.fullName||'N/A'}</span></div>
      <div><strong>Email:</strong> <span id="ci-email">${client.blsEmail||'N/A'}</span></div>
      <div><strong>Visa:</strong> <span id="ci-visa">${client.visa||client.visaType||'N/A'}</span></div>
      <div style="margin-top:10px;display:flex;gap:8px"><button id="ci-edit" style="padding:6px;border-radius:6px;border:none;background:#2563eb;color:#fff;cursor:pointer">Edit</button><button id="ci-close" style="padding:6px;border-radius:6px;border:none;background:#ef4444;color:#fff;cursor:pointer">Close</button></div>
    `;
    document.body.appendChild(panel);
    panel.querySelector('#ci-close').addEventListener('click', ()=> panel.remove());
    panel.querySelector('#ci-edit').addEventListener('click', ()=>{
      const name = prompt('Name', client.fullName || '');
      const email = prompt('Email', client.blsEmail || '');
      const users = JSON.parse(localStorage.getItem('users')||'[]');
      if (users && users.length) {
        users[0].firstName = name; users[0].lastName = ""; users[0].blsEmail = email;
        localStorage.setItem('users', JSON.stringify(users));
        alert('Client saved to localStorage (first user)');
      } else {
        alert('No "users" array in localStorage. Consider using Add User to store clients.');
      }
    });
  }

  function fetchClient() {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users && users.length) return users[0];
    } catch (e) {}
    // fallback demo
    return { fullName: 'ALI', blsEmail: 'ali@example.com', visa: 'Schengen Visa', location: 'Tetouan' };
  }

  (function register(){
    const btn = makeButton();
    btn.addEventListener('click', ()=> {
      const client = fetchClient();
      openPanel(client);
    });
    const tryReg = ()=>{ if(typeof window.registerToolbarButton === 'function'){ window.registerToolbarButton(btn); console.log(`[${MODULE}] registered`); return true;} return false; };
    if(!tryReg()){ const iv=setInterval(()=>{ if(tryReg()) clearInterval(iv); },250); setTimeout(()=>clearInterval(iv),8000); }
  })();
    };

    registerToolbarButton(btn);


 
})();
