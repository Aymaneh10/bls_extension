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

    // Populate Visa Type and Visa SubType inside shadow DOM
    const locationSelect = q('#location');
    const visaTypeSelect = q('#visaType');
    const visaSubTypeSelect = q('#visaSubType');

    if (locationSelect && visaTypeSelect && visaSubTypeSelect) {
      function updateVisaType() {
        const loc = locationSelect.value;
        let options = [];

        if (loc === 'Casablanca') {
          options = ['Casa 1', 'Casa 2', 'Casa 3', 'National Visa'];
        } else {
          options = ['National Visa', 'Schengen Visa'];
        }

        visaTypeSelect.innerHTML = '';
        options.forEach(opt => {
          const option = document.createElement('option');
          option.value = opt;
          option.textContent = opt;
          visaTypeSelect.appendChild(option);
        });

        visaTypeSelect.value = options[0] || '--Select--';
        updateVisaSubType();
      }

      function updateVisaSubType() {
        const loc = locationSelect.value;
        const visaType = visaTypeSelect.value;
        let options = [];

        if (visaType === 'National Visa' && loc === 'Rabat') {
          options = [
            'Students - Language/selectivity',
            'Students - Non-tertiary studies',
            'Students - Graduate studies',
            'Student - Others'
          ];
        } else if (visaType === 'National Visa' && loc === 'Casablanca') {
          options = [
            'Student Visa',
            'Family Reunification Visa',
            'National Visa',
            'Work Visa'
          ];
        } else if (visaType === 'National Visa' && loc === 'Agadir') {
          options = ['Non-university students'];
        } else if (visaType === 'National Visa' && loc === 'Tangier') {
          options = ['Students Less than 6 Months (SSU).'];
        } else if (visaType === 'Schengen Visa' && loc === 'Rabat') {
          options = [
            'Schengen Visa',
            'Schengen Visa - With prior Spain Visa 2024',
            'Schengen Visa – With Prior Schengen Visa 2023'
          ];
        } else if (visaType === 'Schengen Visa' && loc !== 'Rabat') {
          options = ['Schengen Visa'];
        } else if (['Casa 1', 'Casa 2', 'Casa 3'].includes(visaType) && loc === 'Casablanca') {
          options = [visaType];
        } else if (['Casa 1', 'Casa 2', 'Casa 3'].includes(visaType) && loc !== 'Casablanca') {
          options = ['Schengen Visa'];
        }

        visaSubTypeSelect.innerHTML = '';
        if (options.length > 0) {
          options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt;
            option.textContent = opt;
            visaSubTypeSelect.appendChild(option);
          });
          visaSubTypeSelect.value = options[0];
        } else {
          const defaultOption = document.createElement('option');
          defaultOption.value = '--Select--';
          defaultOption.textContent = '--Select--';
          visaSubTypeSelect.appendChild(defaultOption);
          visaSubTypeSelect.value = '--Select--';
        }
      }

      locationSelect.addEventListener('change', updateVisaType);
      visaTypeSelect.addEventListener('change', updateVisaSubType);
      updateVisaType();
    }

    // Ensure 'MANAGE APPLICATION DETAILS' opens the additional modal inside shadow DOM
    const manageBtn = q('.btn-manage');
    if (manageBtn && additionalModal) {
      const clearAdditionalFormShadow = () => {
        const ids = ['firstName','lastName','phoneNumber','passportNumber','issuePlace','dateOfBirth','issueDate','expiryDate','appointmentFor','membersNum'];
        ids.forEach(id => {
          const el = q('#' + id);
          if (el) el.value = '';
        });
        const familyFields = q('#familyFields');
        if (familyFields) familyFields.innerHTML = '';
        const familyMembers = q('#familyMembers');
        if (familyMembers) familyMembers.style.display = 'none';
      };

      manageBtn.addEventListener('click', (e) => {
        e.preventDefault();
        clearAdditionalFormShadow();
        show(additionalModal);
      });
    }

    // Form handling, image preview and users management inside shadow DOM
    const form = q('#applicantForm');
    const imageLinkInput = q('#imageLink');
    const previewImage = q('#previewImage');
    const usersList = q('#usersList');

    function clearApplicantFormShadow() {
      const ids = ['username','blsEmail','blsPassword','appPassword','imageLink','location','visaType','visaSubType','category'];
      ids.forEach(id => {
        const el = q('#' + id);
        if (!el) return;
        if (el.tagName === 'SELECT') el.value = '--Select--'; else el.value = '';
      });
      if (previewImage) previewImage.style.display = 'none';
    }

    if (imageLinkInput && previewImage) {
      imageLinkInput.addEventListener('input', function() {
        const url = this.value.trim();
        if (url) {
          previewImage.src = url;
          previewImage.style.display = 'block';
          previewImage.onerror = function() {
            alert('Invalid image link. Please check the URL.');
            previewImage.style.display = 'none';
          };
        } else {
          previewImage.style.display = 'none';
        }
      });
    }

    function displayUsers() {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      if (!usersList) return;
      usersList.innerHTML = '';
      if (users.length === 0) {
        usersList.innerHTML = '<p>No users found.</p>';
        return;
      }

      users.forEach((user, index) => {
        const fullName = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username || 'N/A';
        const userRow = document.createElement('div');
        userRow.className = 'user-row';
        userRow.innerHTML = `
                <div class="user-image">
                    <img src="${user.imageLink || 'https://via.placeholder.com/50'}" alt="User Image" onerror="this.src='https://via.placeholder.com/50'">
                </div>
                <div class="user-name">${fullName}</div>
                <div class="user-location">${user.location || 'N/A'}</div>
                <div class="user-visa">${user.visaType || 'N/A'}</div>
                <div class="user-actions">
                    <span class="icon-edit" data-index="${index}" title="Edit">✏️</span>
                    <span class="icon-delete" data-index="${index}" title="Delete">🗑️</span>
                </div>
            `;

        userRow.querySelector('.icon-edit').addEventListener('click', function() {
          editUser(index);
        });

        userRow.querySelector('.icon-delete').addEventListener('click', function() {
          if (confirm('Are you sure you want to delete this user?')) {
            deleteUser(index);
          }
        });

        usersList.appendChild(userRow);
      });
    }

    function editUser(index) {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users[index];
      if (!user) return;
      // populate form
      const ids = ['username','blsEmail','blsPassword','appPassword','imageLink','location','visaType','visaSubType','category'];
      ids.forEach(id => {
        const el = q('#' + id);
        if (!el) return;
        if (user[id] !== undefined) el.value = user[id];
      });
      if (previewImage && user.imageLink) { previewImage.src = user.imageLink; previewImage.style.display = 'block'; }

      // store editing index on container
      container.dataset.editIndex = index;

      // show applicant modal
      hide(usersModal);
      show(applicantModal);
    }

    function deleteUser(index) {
      let users = JSON.parse(localStorage.getItem('users')) || [];
      users.splice(index, 1);
      localStorage.setItem('users', JSON.stringify(users));
      displayUsers();
    }

    if (form) {
      form.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = q('#username').value.trim();
        const blsEmail = q('#blsEmail').value.trim();
        const blsPassword = q('#blsPassword').value.trim();
        const appPassword = q('#appPassword').value.trim();
        const location = q('#location').value;
        const visaType = q('#visaType').value;
        const visaSubType = q('#visaSubType').value;
        const category = q('#category').value;

        if (!username || !blsEmail || !blsPassword || !appPassword || location === '--Select--' || visaType === '--Select--' || visaSubType === '--Select--' || category === '--Select--') {
          alert('Please fill all required fields.');
          return;
        }

        const mainData = { username, blsEmail, blsPassword, appPassword, imageLink: q('#imageLink').value.trim(), location, visaType, visaSubType, category };

        let users = JSON.parse(localStorage.getItem('users')) || [];

        if (container.dataset.editIndex !== undefined && container.dataset.editIndex !== '') {
          const idx = parseInt(container.dataset.editIndex, 10);
          users[idx] = mainData;
          container.dataset.editIndex = '';
        } else {
          users.push(mainData);
        }

        localStorage.setItem('users', JSON.stringify(users));

        alert('Form submitted successfully!');
        clearApplicantFormShadow();
        displayUsers();
      });
    }

    // When users modal opens, refresh list
    if (bookmarkBtn && usersModal) {
      bookmarkBtn.addEventListener('click', () => {
        displayUsers();
      });
    }
  }, 300);


// toolbar
// content.js
    // content.js





})();
// content.js — Solution A

(function () {
    console.log("[Content] Injecting toolbar scripts…");

    // List all scripts to inject
    const scriptFiles = [
        "toolbar_loader.js",
        "toolbar/PAGE_REFRESH.js",
        "toolbar/TEST_BUTTON.js",
        // add more button scripts here
    ];

    scriptFiles.forEach(file => {
        const s = document.createElement("script");
        s.src = chrome.runtime.getURL(file);
        s.type = "text/javascript";
        (document.head || document.documentElement).appendChild(s);
    });
})();
