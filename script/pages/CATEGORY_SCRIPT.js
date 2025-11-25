(function () {
  try {
    'use strict';

    // ====================================================
    // 1. جلب البيانات من sessionStorage (الممررة من moder.js)
    // ====================================================
    let CLIENT = {};
    let SETTINGS = {};
    
    try {
        const storedClient = sessionStorage.getItem('BLS_CLIENT_DATA');
        const storedSettings = sessionStorage.getItem('BLS_SETTINGS_DATA');
        
        if (storedClient) CLIENT = JSON.parse(storedClient);
        if (storedSettings) SETTINGS = JSON.parse(storedSettings);
        
        console.log("[CATEGORY] Data Loaded:", CLIENT);
    } catch (e) {
        console.error("[CATEGORY] Failed to parse session data", e);
    }

    // ====================================================
    // 2. تعريف الدوال المساعدة
    // ====================================================

    // دالة لتجهيز زر تغيير الفئة (UI)
    function setupCategoryButton() {
      const categoryBadgeElement = document.querySelector('.categoryNotificationClass');
      if (!categoryBadgeElement) return;

      const categoryOptions = [
          { 'name': "Normal", 'icon': 'fa-user', 'class': "normalBadge", 'code': "CATEGORY_NORMAL" },
          { 'name': "Premium", 'icon': "fa-crown", 'class': "premiumBadge", 'code': "CATEGORY_PREMIUM" },
          { 'name': "Prime Time", 'icon': "fa-star", 'class': "primeTimeBadge", 'code': 'PRIME_TIME' }
      ];

      let currentCategoryIndex = categoryOptions.findIndex(option => categoryBadgeElement.textContent.trim() === option.name);
      if (currentCategoryIndex === -1) currentCategoryIndex = 0;

      function updateCategoryDisplay(selectedOption) {
        categoryBadgeElement.innerHTML = ` <i class="fas ${selectedOption.icon}"></i> ${selectedOption.name} `;
        categoryBadgeElement.className = "infoBadge categoryNotificationClass " + selectedOption["class"];

        // تحديث قوائم Kendo
        document.querySelectorAll('[id$="_listbox"]').forEach(listbox => {
          listbox.querySelectorAll(".k-item").forEach(item => {
            if (item.textContent.trim() === selectedOption.name) item.click();
          });
        });
      }

      categoryBadgeElement.addEventListener('click', function () {
        const nextIndex = (currentCategoryIndex + 1) % categoryOptions.length;
        const nextCategoryOption = categoryOptions[nextIndex];

        if (nextCategoryOption.code === "CATEGORY_PREMIUM") {
          // التعامل مع النافذة المنبثقة للبريميوم
          if (typeof $ !== 'undefined') $("#PremiumTypeModel").modal('show');
          
          const confirmBtn = document.querySelector("#PremiumTypeModel .btn-success");
          if (confirmBtn) {
              confirmBtn.onclick = function () {
                  currentCategoryIndex = nextIndex;
                  updateCategoryDisplay(nextCategoryOption);
                  if (typeof $ !== 'undefined') $("#PremiumTypeModel").modal("hide");
              };
          }
        } else {
          currentCategoryIndex = nextIndex;
          updateCategoryDisplay(nextCategoryOption);
        }
      });
    }

    // دالة لملء النموذج
    function fillFormPt1() {
      console.log("[CATEGORY] Filling form with data:", CLIENT);

      function selectKendoDropdownItem(selector, textToMatch) {
        if (!textToMatch) return;

        // محاولة العثور على العنصر ومحاكاة النقر الحقيقي
        const listItems = document.querySelectorAll(selector);
        let found = false;

        for (const item of listItems) {
          // تنظيف النصوص للمقارنة (إزالة المسافات الزائدة وتحويل لحروف صغيرة)
          const itemText = item.textContent.trim().toLowerCase();
          const targetText = textToMatch.trim().toLowerCase();

          if (itemText === targetText || itemText.includes(targetText)) {
            console.log(`[CATEGORY] Selecting: ${item.textContent}`);
            item.scrollIntoView(); // تأكد من أن العنصر مرئي
            item.click(); // نقرة Kendo UI
            found = true;
            break;
          }
        }

        if (!found) {
            console.warn(`[CATEGORY] Could not find item matching: ${textToMatch}`);
        }
      }

      // البحث عن كل الأقسام المرئية في النموذج
      document.querySelectorAll("form > div > div").forEach(formSection => {
         const style = window.getComputedStyle(formSection);
         if (style.display === 'none' || style.visibility === 'hidden') return;

         formSection.querySelectorAll("span > input").forEach(kendoInput => {
             if (!kendoInput.id) return;

             // العثور على الـ Label المرتبط بهذا الـ Input
             // أحياناً يكون الـ Label فوق العنصر بمسافة
             const parentDiv = kendoInput.closest('.mb-3');
             const label = parentDiv ? parentDiv.querySelector('label') : null;

             if (!label) return;

             const txt = label.textContent.trim();
             const listSelector = '#' + kendoInput.id + "_listbox > li.k-item";

             // فتح القائمة المنسدلة
             const dropdownWidget = $(`#${kendoInput.id}`).data("kendoDropDownList");

             if (txt.includes("Location")) {
                 if(dropdownWidget) dropdownWidget.open();
                 selectKendoDropdownItem(listSelector, CLIENT.location);
             }
             else if (txt.includes("Visa Type")) {
                 if(dropdownWidget) dropdownWidget.open();
                 let vType = CLIENT.visaType;
                 if (vType && vType.includes("First application")) vType = "First application";
                 selectKendoDropdownItem(listSelector, vType);
             }
             else if (txt.includes("Visa Sub Type")) {
                 if(dropdownWidget) dropdownWidget.open();
                 selectKendoDropdownItem(listSelector, CLIENT.visaSubType);
             }
             // === هنا الإصلاح الرئيسي للفئة (Category) ===
             else if (txt.includes("Category")) {
                 console.log("[CATEGORY] Found Category field. Attempting to select:", CLIENT.category); // لاحظ أن الاسم في JSON هو 'category'

                 if(dropdownWidget) {
                     dropdownWidget.open(); // فتح القائمة إجبارياً

                     // انتظار قصير جداً للتأكد من أن القائمة فُتحت وتم تحميل العناصر
                     setTimeout(() => {
                         // نستخدم CLIENT.category (التي قيمتها "Normal") بدلاً من CLIENT.apptCategory
                         // لأن البيانات في الكونسول تظهر المفتاح باسم "category"
                         const categoryValue = CLIENT.category || CLIENT.apptCategory || "Normal";
                         selectKendoDropdownItem(listSelector, categoryValue);
                     }, 200);
                 }
             }
             else if (txt.includes("Number Of Members")) {
                if(dropdownWidget) dropdownWidget.open();
                const memText = (CLIENT.numberOfMembers || 1) + " Members";
                selectKendoDropdownItem(listSelector, memText);
             }
         });

         // Appointment For
         const apptValue = CLIENT.appointmentFor || "Individual";
         formSection.querySelectorAll("div.form-check > input").forEach(radio => {
             if (radio.value.toLowerCase() === apptValue.toLowerCase()) {
                 radio.click();
             }
         });
      });

      // محاولة الإرسال
      setTimeout(autoSubmit, 2000); // زيادة الوقت قليلاً للسماح باختيار الفئة
    }

    // دالة الإرسال التلقائي
    function autoSubmit() {
        // نتحقق من الإعدادات الجديدة
        // في moder.js قمنا بتعيين auto_category = ON افتراضياً
        // يمكنك إضافة شرط هنا إذا أردت
        
        const submitButton = document.querySelector("#btnSubmit");
        if (submitButton) {
            console.log("[CATEGORY] Auto-submitting...");
            submitButton.click();
        }
    }

    // دالة لإغلاق النوافذ المنبثقة المزعجة
    function autoDismissAllModals() {
        const modals = [
            { id: "VisaTypeModel", btn: '.btn-success' },
            { id: 'PremiumTypeModel', btn: '.btn-success' },
            { id: 'familyDisclaimer', btn: ".btn-success" },
            { id: 'Alg1Visatype', btn: '.btn-primary' }
        ];

        modals.forEach(m => {
            const el = document.getElementById(m.id);
            if (el) {
                // محاولة إغلاق فورية إذا كانت مفتوحة بالفعل
                if(el.classList.contains('show') || el.style.display === 'block') {
                    const btn = el.querySelector(m.btn);
                    if(btn) btn.click();
                }
                
                // مراقب للفتح المستقبلي
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.attributeName === "class" || mutation.attributeName === "style") {
                             if(el.classList.contains('show') || el.style.display === 'block') {
                                const btn = el.querySelector(m.btn);
                                if(btn) { console.log("Dismissing modal:", m.id); btn.click(); }
                             }
                        }
                    });
                });
                observer.observe(el, { attributes: true });
            }
        });
    }

    // ====================================================
    // 3. التنفيذ الرئيسي (Main Execution)
    // ====================================================
    
    // ننتظر تحميل الصفحة بالكامل
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startScript);
    } else {
        startScript();
    }

    function startScript() {
        console.log("[CATEGORY] Script Started");
        autoDismissAllModals();
        
        // تأخير بسيط جداً لضمان تحميل عناصر Kendo UI
        setTimeout(() => {
            fillFormPt1();
            setupCategoryButton();
        }, 5000); 
    }

  } catch (e) {
    console.error('[CATEGORY] Critical Error:', e);
  }
})();