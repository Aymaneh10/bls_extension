// Merged JavaScript from all files: script.js, additional-script.js, addUser.js, manageUsers.js

document.addEventListener('DOMContentLoaded', function() {
    // Elements from original script.js
    const form = document.getElementById('applicantForm');
    const imageLinkInput = document.getElementById('imageLink');
    const previewImage = document.getElementById('previewImage');
    const locationSelect = document.getElementById('location');
    const visaTypeSelect = document.getElementById('visaType');
    const visaSubTypeSelect = document.getElementById('visaSubType');

    // Elements from additional-script.js
    const additionalModal = document.getElementById('additionalModal');
    const additionalForm = document.getElementById('additionalForm');
    const appointmentFor = document.getElementById('appointmentFor');
    const familyMembers = document.getElementById('familyMembers');
    const membersNum = document.getElementById('membersNum');
    const familyFields = document.getElementById('familyFields');
    const additionalCloseBtn = document.querySelector('#additionalModal .close-btn');

    // Elements from addUser.js
    const buttonContainer = document.querySelector('.button-container');
    const addUserButton = document.querySelector('.add-user-button');
    const applicantCloseBtn = document.querySelector('#applicantModal .close-btn');

    // Elements from manageUsers.js
    const bookmarkButton = document.querySelector('.bookmark-button');
    const usersModal = document.getElementById('usersModal');
    const usersList = document.getElementById('usersList');
    const usersCloseBtn = usersModal.querySelector('.close-btn');

    // Drag functionality for applicant modal (from script.js)
    const applicantModal = document.getElementById('applicantModal');
    const applicantModalHeader = applicantModal.querySelector('.modal-header');
    let isApplicantDragging = false;
    let applicantStartX, applicantStartY, applicantInitialX, applicantInitialY;

    applicantModalHeader.addEventListener('mousedown', function(e) {
        isApplicantDragging = true;
        applicantStartX = e.clientX;
        applicantStartY = e.clientY;
        const rect = applicantModal.getBoundingClientRect();
        applicantInitialX = rect.left;
        applicantInitialY = rect.top;
        applicantModal.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', function(e) {
        if (!isApplicantDragging) return;
        const dx = e.clientX - applicantStartX;
        const dy = e.clientY - applicantStartY;
        applicantModal.style.left = applicantInitialX + dx + 'px';
        applicantModal.style.top = applicantInitialY + dy + 'px';
        applicantModal.style.transform = 'none';
    });

    document.addEventListener('mouseup', function() {
        if (isApplicantDragging) {
            isApplicantDragging = false;
            applicantModal.style.cursor = 'default';
        }
    });

    // Drag functionality for additional modal (from additional-script.js)
    const additionalModalHeader = additionalModal.querySelector('.modal-header');
    let isAdditionalDragging = false;
    let additionalStartX, additionalStartY, additionalInitialX, additionalInitialY;

    additionalModalHeader.addEventListener('mousedown', function(e) {
        isAdditionalDragging = true;
        additionalStartX = e.clientX;
        additionalStartY = e.clientY;
        const rect = additionalModal.getBoundingClientRect();
        additionalInitialX = rect.left;
        additionalInitialY = rect.top;
        additionalModal.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', function(e) {
        if (!isAdditionalDragging) return;
        const dx = e.clientX - additionalStartX;
        const dy = e.clientY - additionalStartY;
        additionalModal.style.left = additionalInitialX + dx + 'px';
        additionalModal.style.top = additionalInitialY + dy + 'px';
        additionalModal.style.transform = 'none';
    });

    document.addEventListener('mouseup', function() {
        if (isAdditionalDragging) {
            isAdditionalDragging = false;
            additionalModal.style.cursor = 'default';
        }
    });

    // Drag functionality for users modal (from manageUsers.js)
    const usersModalHeader = usersModal.querySelector('.modal-header');
    let isUsersDragging = false;
    let usersStartX, usersStartY, usersInitialX, usersInitialY;

    usersModalHeader.addEventListener('mousedown', function(e) {
        isUsersDragging = true;
        usersStartX = e.clientX;
        usersStartY = e.clientY;
        const rect = usersModal.getBoundingClientRect();
        usersInitialX = rect.left;
        usersInitialY = rect.top;
        usersModal.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', function(e) {
        if (!isUsersDragging) return;
        const dx = e.clientX - usersStartX;
        const dy = e.clientY - usersStartY;
        usersModal.style.left = usersInitialX + dx + 'px';
        usersModal.style.top = usersInitialY + dy + 'px';
        usersModal.style.transform = 'none';
    });

    document.addEventListener('mouseup', function() {
        if (isUsersDragging) {
            isUsersDragging = false;
            usersModal.style.cursor = 'default';
        }
    });

    // Drag functionality for button container (from addUser.js)
    let isButtonDragging = false;
    let buttonStartX, buttonStartY, buttonInitialX, buttonInitialY;

    buttonContainer.addEventListener('mousedown', function(e) {
        isButtonDragging = true;
        buttonStartX = e.clientX;
        buttonStartY = e.clientY;
        const rect = buttonContainer.getBoundingClientRect();
        buttonInitialX = rect.left;
        buttonInitialY = rect.top;
        buttonContainer.style.cursor = 'grabbing';
        e.preventDefault();
    });

    document.addEventListener('mousemove', function(e) {
        if (!isButtonDragging) return;
        const dx = e.clientX - buttonStartX;
        const dy = e.clientY - buttonStartY;
        buttonContainer.style.left = buttonInitialX + dx + 'px';
        buttonContainer.style.top = buttonInitialY + dy + 'px';
        buttonContainer.style.position = 'absolute';
        buttonContainer.style.transform = 'none';
    });

    document.addEventListener('mouseup', function() {
        if (isButtonDragging) {
            isButtonDragging = false;
            buttonContainer.style.cursor = 'grab';
        }
    });

    // Function to update Visa Type based on Location (from script.js)
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

    // Function to update Visa Sub Type based on Location and Visa Type (from script.js)
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

    // Event listeners for changes (from script.js)
    locationSelect.addEventListener('change', updateVisaType);
    visaTypeSelect.addEventListener('change', updateVisaSubType);
    updateVisaType();

    // Preview image when link is entered (from script.js)
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

    // Form submission validation (from script.js)
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value.trim();
        const blsEmail = document.getElementById('blsEmail').value.trim();
        const blsPassword = document.getElementById('blsPassword').value.trim();
        const appPassword = document.getElementById('appPassword').value.trim();
        const location = document.getElementById('location').value;
        const visaType = document.getElementById('visaType').value;
        const visaSubType = document.getElementById('visaSubType').value;
        const category = document.getElementById('category').value;

        if (!username || !blsEmail || !blsPassword || !appPassword || location === '--Select--' || visaType === '--Select--' || visaSubType === '--Select--' || category === '--Select--') {
            alert('Please fill all required fields.');
            return;
        }

        const mainData = {
            username,
            blsEmail,
            blsPassword,
            appPassword,
            location,
            visaType,
            visaSubType,
            category
        };

        const additionalData = localStorage.getItem('additionalInfo');
        let clientData = mainData;

        if (additionalData) {
            const parsedAdditional = JSON.parse(additionalData);
            clientData = { ...mainData, ...parsedAdditional };
            localStorage.removeItem('additionalInfo');
        }

        let users = JSON.parse(localStorage.getItem('users')) || [];

        if (window.editingUserIndex !== undefined) {
            users[window.editingUserIndex] = clientData;
            delete window.editingUserIndex;
        } else {
            users.push(clientData);
        }

        localStorage.setItem('users', JSON.stringify(users));

        alert('Form submitted successfully!');
        form.reset();
        previewImage.style.display = 'none';
    });

    // Close applicant modal (from script.js and addUser.js)
    applicantCloseBtn.addEventListener('click', function() {
        applicantModal.classList.remove('show');
        setTimeout(() => applicantModal.style.display = 'none', 300);
    });

    // Manage button (from script.js)
    document.querySelector('.btn-manage').addEventListener('click', function() {
        if (window.clearAdditionalForm) {
            window.clearAdditionalForm();
        }
        additionalModal.style.display = 'block';
        setTimeout(() => additionalModal.classList.add('show'), 10);
    });

    // Additional modal functionality (from additional-script.js)
    appointmentFor.addEventListener('change', function() {
        familyMembers.style.display = this.value === 'Family' ? 'block' : 'none';
        if (this.value !== 'Family') familyFields.innerHTML = '';
    });

    membersNum.addEventListener('input', function() {
        familyFields.innerHTML = '';
    });

    additionalCloseBtn.addEventListener('click', function() {
        additionalModal.classList.remove('show');
        setTimeout(() => additionalModal.style.display = 'none', 300);
    });

    additionalForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(additionalForm);
        const data = Object.fromEntries(formData.entries());
        localStorage.setItem('additionalInfo', JSON.stringify(data));
        fetch('https://your-api.com/submit', { method: 'POST', body: JSON.stringify(data) })
            .then(res => res.json())
            .then(() => alert('Submitted successfully!'))
            .catch(() => alert('Error submitting.'));
        additionalModal.classList.remove('show');
        setTimeout(() => additionalModal.style.display = 'none', 300);
        additionalForm.reset();
    });

    // Clear additional form function (from additional-script.js)
    function clearAdditionalForm() {
        document.getElementById('firstName').value = '';
        document.getElementById('lastName').value = '';
        document.getElementById('phoneNumber').value = '';
        document.getElementById('passportNumber').value = '';
        document.getElementById('issuePlace').value = '';
        document.getElementById('dateOfBirth').value = '';
        document.getElementById('issueDate').value = '';
        document.getElementById('expiryDate').value = '';
        document.getElementById('appointmentFor').value = '';
        document.getElementById('membersNum').value = '';
        document.getElementById('familyFields').innerHTML = '';
        document.getElementById('familyMembers').style.display = 'none';
    }
    window.clearAdditionalForm = clearAdditionalForm;

    // Add user button (from addUser.js)
    addUserButton.addEventListener('click', function(e) {
        if (isButtonDragging) return;
        clearApplicantForm();
        applicantModal.style.display = 'block';
        setTimeout(() => applicantModal.classList.add('show'), 10);
    });

    // Function to clear the applicant form (from addUser.js)
    function clearApplicantForm() {
        document.getElementById('username').value = '';
        document.getElementById('blsEmail').value = '';
        document.getElementById('blsPassword').value = '';
        document.getElementById('appPassword').value = '';
        document.getElementById('imageLink').value = '';
        document.getElementById('previewImage').style.display = 'none';
        document.getElementById('location').value = '--Select--';
        document.getElementById('visaType').value = '--Select--';
        document.getElementById('visaSubType').value = '--Select--';
        document.getElementById('category').value = '--Select--';
    }

    // Manage users functionality (from manageUsers.js)
    bookmarkButton.addEventListener('click', function() {
        displayUsers();
        usersModal.style.display = 'block';
        setTimeout(() => usersModal.classList.add('show'), 10);
    });

    usersCloseBtn.addEventListener('click', function() {
        usersModal.classList.remove('show');
        setTimeout(() => usersModal.style.display = 'none', 300);
    });

    function displayUsers() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
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
                    <span class="icon-edit" data-index="${index}" title="Edit">&#9998;</span>
                    <span class="icon-delete" data-index="${index}" title="Delete">&#128465;</span>
                </div>
            `;

            userRow.querySelector('.icon-edit').addEventListener('click', function() {
                editUser(user, index);
            });

            userRow.querySelector('.icon-delete').addEventListener('click', function() {
                if (confirm('Are you sure you want to delete this user?')) {
                    deleteUser(index);
                }
            });

            usersList.appendChild(userRow);
        });
    }

    function editUser(userData, index) {
        document.getElementById('username').value = userData.username || '';
        document.getElementById('blsEmail').value = userData.blsEmail || '';
        document.getElementById('blsPassword').value = userData.blsPassword || '';
        document.getElementById('appPassword').value = userData.appPassword || '';
        document.getElementById('location').value = userData.location || '--Select--';
        document.getElementById('visaType').value = userData.visaType || '--Select--';
        document.getElementById('visaSubType').value = userData.visaSubType || '--Select--';
        document.getElementById('category').value = userData.category || '--Select--';

        if (userData.firstName) {
            document.getElementById('firstName').value = userData.firstName || '';
            document.getElementById('lastName').value = userData.lastName || '';
            document.getElementById('phoneNumber').value = userData.phoneNumber || '';
            document.getElementById('passportNumber').value = userData.passportNumber || '';
            document.getElementById('issuePlace').value = userData.issuePlace || '';
            document.getElementById('dateOfBirth').value = userData.dateOfBirth || '';
            document.getElementById('issueDate').value = userData.issueDate || '';
            document.getElementById('expiryDate').value = userData.expiryDate || '';
            document.getElementById('appointmentFor').value = userData.appointmentFor || '';
        }

        window.editingUserIndex = index;

        usersModal.classList.remove('show');
        setTimeout(() => {
            usersModal.style.display = 'none';
            applicantModal.style.display = 'block';
            setTimeout(() => applicantModal.classList.add('show'), 10);
        }, 300);
    }

    function deleteUser(index) {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users.splice(index, 1);
        localStorage.setItem('users', JSON.stringify(users));
        displayUsers();
    }
});
