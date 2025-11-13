(async () => {
  // Create an invisible layer that sits above the website
  const container = document.createElement("div");
  container.id = "bls-extension-overlay";
  container.style.position = "fixed";
  container.style.top = "0";
  container.style.left = "0";
  container.style.width = "100vw";
  container.style.height = "100vh";
  container.style.pointerEvents = "none"; // ⬅ website remains interactive
  container.style.zIndex = "999999"; // ⬅ always on top
  document.body.appendChild(container);

  // Attach shadow DOM (isolates your CSS from the site)
  const shadow = container.attachShadow({ mode: "open" });

  // Load your UI HTML
  const html = await fetch(chrome.runtime.getURL("ui/index.html")).then(r => r.text());
  const wrapper = document.createElement("div");
  wrapper.innerHTML = html;
  shadow.appendChild(wrapper);

  // Load your CSS
  const style = document.createElement("link");
  style.rel = "stylesheet";
  style.href = chrome.runtime.getURL("ui/styles.css");
  shadow.appendChild(style);

  // Wait until HTML is ready
  setTimeout(() => {
    const q = (s) => shadow.querySelector(s);

    // Make your main button container active (clickable)
    const panel = q(".button-container");
    panel.style.position = "fixed";
    panel.style.top = "20px";
    panel.style.right = "20px";
    panel.style.pointerEvents = "auto"; // ⬅ now this element can receive clicks
    panel.style.zIndex = "1000000";

    // Make it draggable
    let isDragging = false;
    let startX, startY, initX, initY;
    panel.addEventListener("mousedown", (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = panel.getBoundingClientRect();
      initX = rect.left;
      initY = rect.top;
      panel.style.cursor = "grabbing";
      e.preventDefault();
    });
    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      panel.style.left = initX + dx + "px";
      panel.style.top = initY + dy + "px";
      panel.style.right = "auto";
    });
    document.addEventListener("mouseup", () => {
      isDragging = false;
      panel.style.cursor = "grab";
    });

    // Handle modals
    const show = (el) => {
      el.style.display = "block";
      el.style.pointerEvents = "auto"; // enable clicks on modal
      setTimeout(() => el.classList.add("show"), 10);
    };
    const hide = (el) => {
      el.classList.remove("show");
      setTimeout(() => {
        el.style.display = "none";
        el.style.pointerEvents = "none";
      }, 300);
    };

    const addUserBtn = q(".add-user-button");
    const applicantModal = q("#applicantModal");
    const applicantClose = q("#applicantModal .close-btn");

    const bookmarkBtn = q(".bookmark-button");
    const usersModal = q("#usersModal");
    const usersClose = q("#usersModal .close-btn");

    const settingsBtn = q(".settings-button");
    const additionalModal = q("#additionalModal");
    const additionalClose = q("#additionalModal .close-btn");

    addUserBtn.addEventListener("click", () => show(applicantModal));
    applicantClose.addEventListener("click", () => hide(applicantModal));

    bookmarkBtn.addEventListener("click", () => show(usersModal));
    usersClose.addEventListener("click", () => hide(usersModal));

    settingsBtn.addEventListener("click", () => show(additionalModal));
    additionalClose.addEventListener("click", () => hide(additionalModal));
  }, 300);
})();
