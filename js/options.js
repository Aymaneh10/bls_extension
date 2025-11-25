document.addEventListener('DOMContentLoaded', async function () {
    
    // ========================================================
    // 1. تهيئة المتغيرات والثوابت
    // ========================================================
    const resultsContainer = document.getElementById('results');
    const nationalityFilterBtn = document.querySelector('.filter[data-filter="nationality"]');
    const centerFilterBtn = document.querySelector('.filter[data-filter="center"]');
    const toggleThemeBtn = document.getElementById('toggle1');
    
    // متغيرات الحالة
    let allClients = [];
    let currentFilter = { nationality: null, center: null };

    // ========================================================
    // 2. وظائف التخزين (Storage API Wrapper)
    // ========================================================
    const storageAPI = {
        get: (keys) => new Promise((resolve) => {
            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                chrome.storage.local.get(keys, (result) => resolve(result));
            } else {
                // Fallback للمتصفح العادي للتجربة
                let result = {};
                if (typeof keys === 'string') keys = [keys];
                keys.forEach(key => {
                    try { result[key] = JSON.parse(localStorage.getItem(key)); } catch (e) {}
                });
                resolve(result);
            }
        }),
        set: (obj) => new Promise((resolve) => {
            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                chrome.storage.local.set(obj, () => resolve());
            } else {
                Object.keys(obj).forEach(key => localStorage.setItem(key, JSON.stringify(obj[key])));
                resolve();
            }
        }),
        remove: (keys) => new Promise((resolve) => {
            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                chrome.storage.local.remove(keys, () => resolve());
            } else {
                if(Array.isArray(keys)) keys.forEach(k => localStorage.removeItem(k));
                resolve();
            }
        })
    };

    // ========================================================
    // 3. الوظائف الأساسية (Core Functions)
    // ========================================================

    // تحميل العملاء وعرضهم
    async function loadClients() {
        const data = await storageAPI.get('users'); // الاسم المستخدم في script.js هو 'users'
        allClients = data.users || [];
        
        // إذا لم يوجد عملاء
        if (allClients.length === 0) {
            resultsContainer.innerHTML = `
                <div class="empty-clients-mssg" style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:200px; color:#aaa;">
                    <i class="fa-solid fa-circle-xmark" style="font-size: 30px; margin-bottom: 10px;"></i>
                    <h6>No clients have been added yet</h6>
                </div>`;
            return;
        }

        renderClients(allClients);
    }

    // رسم العملاء في الواجهة (HTML Generation)
    function renderClients(clientsToRender) {
        resultsContainer.innerHTML = '';

        clientsToRender.forEach((client, index) => {
            // تحديد العلم
            let flagSrc = 'Img/Maroc.png';
            if (client.location && ['algiers', 'oran'].includes(client.location.toLowerCase())) {
                flagSrc = 'Img/Algeria.png';
            }

            // تحديد الصورة الافتراضية الصحيحة (بناء على طلبك)
            // ملاحظة: تأكد أن المسار Img/empty-profile.png صحيح بالنسبة لمكان ملف HTML
            const defaultImg = 'Img/empty-profile.png';
            const imgLink = client.imageLink && client.imageLink.trim() !== "" ? client.imageLink : defaultImg;

            const displayName = (client.firstName && client.lastName)
                ? `${client.firstName} ${client.lastName}`
                : (client.username || 'Unknown User');

            const clientDiv = document.createElement('div');
            clientDiv.className = 'client-entry';
            clientDiv.setAttribute('data-client-index', index);

            // الهيكل الجديد المرتب
            clientDiv.innerHTML = `
                <div class="client-info-wrapper">
                    <div class="client-img-container">
                        <img src="${imgLink}" class="saved-client-img" onerror="this.src='${defaultImg}'">
                    </div>

                    <div class="client-text-details">
                        <span class="client-name" title="${displayName}">${displayName}</span>
                        <div class="client-sub-details">
                            <span>${client.visaType || 'N/A'}</span>
                            <span>•</span>
                            <span>${client.location || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <div class="client-actions-wrapper">
                    <img src="${flagSrc}" class="client-flag" title="${client.location || ''}">

                    <button class="play-btn" data-state="play" data-index="${index}">
                         <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21.4086 9.35258C23.5305 10.5065 23.5305 13.4935 21.4086 14.6474L8.59662 21.6145C6.53435 22.736 4 21.2763 4 18.9671L4 5.0329C4 2.72368 6.53435 1.26402 8.59661 2.38548L21.4086 9.35258Z" fill="#ffffff"></path>
                        </svg>
                    </button>

                    <i class="fa-solid fa-trash delete-client-btn" data-index="${index}" title="Delete Client"></i>
                </div>
            `;

            resultsContainer.appendChild(clientDiv);
        });

        attachClientEventListeners();
    }

    function attachClientEventListeners() {
        // زر الحذف
        document.querySelectorAll('.delete-client-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const index = e.target.getAttribute('data-index');
                if (confirm('Are you sure you want to delete this client?')) {
                    allClients.splice(index, 1);
                    await storageAPI.set({ users: allClients });
                    loadClients(); // إعادة تحميل القائمة
                }
            });
        });

        // زر التشغيل (مجرد تغيير شكلي وحفظ الحالة)
        document.querySelectorAll('.play-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                // Always read the index from the button element itself to avoid
                // cases where the actual click target is an inner SVG/path
                const index = btn.getAttribute('data-index');
                const currentState = btn.getAttribute('data-state');
                
                // إعادة تعيين جميع الأزرار الأخرى
                document.querySelectorAll('.play-btn').forEach(b => {
                    b.setAttribute('data-state', 'play');
                    b.innerHTML = `<svg width="15px" height="15px" viewBox="0 0 24 24" fill="none"><path d="M21.4086 9.35258C23.5305 10.5065 23.5305 13.4935 21.4086 14.6474L8.59662 21.6145C6.53435 22.736 4 21.2763 4 18.9671L4 5.0329C4 2.72368 6.53435 1.26402 8.59661 2.38548L21.4086 9.35258Z" fill="#ffffff"></path></svg>`;
                    b.closest('.client-entry').classList.remove('active');
                });

                if (currentState === 'play') {
                    btn.setAttribute('data-state', 'pause');
                    btn.innerHTML = `<i class="fa-solid fa-pause"></i>`; // استبدال أيقونة الإيقاف المؤقت
                    btn.closest('.client-entry').classList.add('active');
                    
                    // حفظ العميل النشط ليقرأه content.js
                    const numericIndex = parseInt(index, 10);
                    const activeClient = allClients[numericIndex];
                    await storageAPI.set({
                        activeClientIndex: numericIndex,
                        activeClientData: activeClient,
                        scriptExecutionState: { isRunning: true, activeClientId: numericIndex }
                    });

                    // 2. فتح رابط تسجيل الدخول في تبويب جديد (الإضافة الجديدة)
                    // سيقوم moder.js بقراءة الحالة "isRunning: true" من التخزين ويبدأ العمل تلقائياً
                    chrome.tabs.create({
                        url: 'https://www.blsspainmorocco.net/MAR/Account/LogIn?ReturnUrl=%2FMAR%2Fappointment%2Fnewappointment'
                    });

                    // إرسال رسالة للخلفية (اختياري) مع clientIndex رقمي
                    try { chrome.runtime.sendMessage({ action: "START_SCRIPT", clientIndex: numericIndex }); } catch(e){}

                } else {
                    // إيقاف
                    await storageAPI.set({ 
                        scriptExecutionState: { isRunning: false } 
                    });
                    try { chrome.runtime.sendMessage({ action: "STOP_SCRIPT" }); } catch(e){}
                }
            });
        });
    }

    // ========================================================
    // 4. إدارة الفلاتر (Filters)
    // ========================================================
    
    nationalityFilterBtn.addEventListener('click', () => {
        // تدوير حالة الفلتر: الكل -> الجزائر -> المغرب -> الكل
        if (!currentFilter.nationality) currentFilter.nationality = 'Algeria';
        else if (currentFilter.nationality === 'Algeria') currentFilter.nationality = 'Morocco';
        else currentFilter.nationality = null;
        
        updateFilterUI();
        applyFilters();
    });

    centerFilterBtn.addEventListener('click', () => {
        // هذا مثال بسيط، يمكنك توسيعه ليشمل كل المراكز
        const centers = ['Casablanca', 'Rabat', 'Tangier', 'Nador', 'Agadir', 'Algiers', 'Oran'];
        const currentIndex = centers.indexOf(currentFilter.center);
        
        if (currentIndex === -1) currentFilter.center = centers[0];
        else if (currentIndex === centers.length - 1) currentFilter.center = null;
        else currentFilter.center = centers[currentIndex + 1];

        updateFilterUI();
        applyFilters();
    });

    function updateFilterUI() {
        // تحديث نصوص وألوان الأزرار
        const natTextSpan = document.getElementById('nationalityText');
        const centerTextSpan = document.getElementById('centerText');

        if (currentFilter.nationality) {
            nationalityFilterBtn.classList.add('active-button');
            natTextSpan.textContent = currentFilter.nationality;
            // تغيير اللون حسب الدولة
            nationalityFilterBtn.style.backgroundColor = currentFilter.nationality === 'Algeria' ? '#006633' : '#c1272d';
            nationalityFilterBtn.style.color = '#fff';
        } else {
            nationalityFilterBtn.classList.remove('active-button');
            natTextSpan.textContent = 'Nationality';
            nationalityFilterBtn.style.backgroundColor = '';
            nationalityFilterBtn.style.color = '';
        }

        if (currentFilter.center) {
            centerFilterBtn.classList.add('active-button');
            centerTextSpan.textContent = currentFilter.center;
            centerFilterBtn.style.backgroundColor = '#2196f3'; // لون أزرق للمركز
            centerFilterBtn.style.color = '#fff';
        } else {
            centerFilterBtn.classList.remove('active-button');
            centerTextSpan.textContent = 'Center';
            centerFilterBtn.style.backgroundColor = '';
            centerFilterBtn.style.color = '';
        }
    }

    function applyFilters() {
        let filtered = allClients;

        if (currentFilter.nationality) {
            // فلترة حسب الموقع التقريبي لأن الجنسية قد لا تكون مخزنة صراحة
            if (currentFilter.nationality === 'Algeria') {
                filtered = filtered.filter(c => ['algiers', 'oran'].includes(c.location?.toLowerCase()));
            } else if (currentFilter.nationality === 'Morocco') {
                filtered = filtered.filter(c => !['algiers', 'oran'].includes(c.location?.toLowerCase()));
            }
        }

        if (currentFilter.center) {
            filtered = filtered.filter(c => c.location?.toLowerCase() === currentFilter.center.toLowerCase());
        }

        renderClients(filtered);
    }

    // ========================================================
    // 5. إعدادات النظام والوضع الليلي
    // ========================================================

    // الوضع الليلي
    toggleThemeBtn.addEventListener('click', () => {
        document.body.classList.toggle('night-mode');
        const isNight = document.body.classList.contains('night-mode');
        toggleThemeBtn.classList.toggle('on', isNight);
        localStorage.setItem('theme', isNight ? 'night' : 'day');
    });

    // استرجاع الثيم المحفوظ
    if (localStorage.getItem('theme') === 'night') {
        document.body.classList.add('night-mode');
        toggleThemeBtn.classList.add('on');
    }

    // تعبئة معلومات النظام الوهمية (لأننا لا نملك السيرفر)
    function fillSystemInfo() {
        document.getElementById('deviceUUIDKey').textContent = "LOCAL-DEV-ID-001";
        document.getElementById('deviceUUIDKey').classList.remove('loading');
        
        document.getElementById('cpuIDKey').textContent = navigator.hardwareConcurrency + " Cores";
        document.getElementById('cpuIDKey').classList.remove('loading');

        // تحديث شريط التقدم (وهمي: 30 يوم)
        const daysNum = document.getElementById('days-number');
        if (daysNum) {
            daysNum.textContent = "Active";
            daysNum.style.color = "#35bf8b";
        }
    }
    
    // تهيئة التبويبات (Tabs)
    const tabInputs = document.querySelectorAll('input[name="tab"]');
    tabInputs.forEach(input => {
        input.addEventListener('change', function() {
            // إخفاء كل الأقسام
            document.querySelector('.client-list-section').classList.add('hidden');
            document.querySelector('.system-info-section').classList.add('hidden');
            document.querySelector('.support-section').classList.add('hidden');

            // إظهار القسم المختار
            if (this.id === 'tab1') document.querySelector('.client-list-section').classList.remove('hidden');
            if (this.id === 'tab2') document.querySelector('.system-info-section').classList.remove('hidden');
            if (this.id === 'tab3') document.querySelector('.support-section').classList.remove('hidden');
        });
    });

    // ========================================================
    // 6. التشغيل عند البدء
    // ========================================================
    fillSystemInfo();
    await loadClients();
    // بعد تحميل العملاء، مزامنة حالة التشغيل (تشغيل/إيقاف) مع التخزين
    await updatePlayButtonState();
    
    // الاستماع لتغييرات التخزين (لتحديث القائمة تلقائياً إذا تم إضافة عميل جديد من الصفحة الرئيسية)
    chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'local') {
            if (changes.users) {
                loadClients();
            }
            if (changes.scriptExecutionState) {
                // تحديث أزرار التشغيل/إيقاف لتعكس الحالة الحالية
                updatePlayButtonState();
            }
        }
    });
});

// تحديث واجهة الأزرار لتعكس حالة التشغيل المخزنة
async function updatePlayButtonState() {
    try {
        const data = await (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local ?
            new Promise(r => chrome.storage.local.get(['scriptExecutionState', 'activeClientIndex'], r)) :
            Promise.resolve({ scriptExecutionState: JSON.parse(localStorage.getItem('scriptExecutionState') || 'null'), activeClientIndex: JSON.parse(localStorage.getItem('activeClientIndex') || 'null') })
        );

        // إعادة ضبط كل الأزرار أولاً
        const defaultSvg = `<svg width="15px" height="15px" viewBox="0 0 24 24" fill="none"><path d="M21.4086 9.35258C23.5305 10.5065 23.5305 13.4935 21.4086 14.6474L8.59662 21.6145C6.53435 22.736 4 21.2763 4 18.9671L4 5.0329C4 2.72368 6.53435 1.26402 8.59661 2.38548L21.4086 9.35258Z" fill="#ffffff"></path></svg>`;
        document.querySelectorAll('.play-btn').forEach(b => {
            b.setAttribute('data-state', 'play');
            b.innerHTML = defaultSvg;
            b.closest('.client-entry')?.classList.remove('active');
        });

        const state = data.scriptExecutionState;
        if (state && state.isRunning) {
            const idx = (state.activeClientId !== undefined && state.activeClientId !== null) ? state.activeClientId : data.activeClientIndex;
            if (idx !== undefined && idx !== null) {
                const btn = document.querySelector(`.play-btn[data-index="${idx}"]`);
                if (btn) {
                    btn.setAttribute('data-state', 'pause');
                    btn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
                    btn.closest('.client-entry')?.classList.add('active');
                }
            }
        }
    } catch (err) {
        console.error('Error updating play button state', err);
    }
}