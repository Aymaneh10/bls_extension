(function () {
  // 1. استخدام البيانات التي مررها moder.js عبر sessionStorage
  let clientData = {};
  try {
      const stored = sessionStorage.getItem('BLS_CLIENT_DATA');
      if (stored) clientData = JSON.parse(stored);
      // تنظيف البيانات بعد القراءة لزيادة الأمان (اختياري)
      // sessionStorage.removeItem('BLS_CLIENT_DATA');
  } catch (e) { console.error("Failed to parse client data", e); }

  try {
    'use strict';
    console.log("[LOGIN_SCRIPT] Started. Client data loaded:", clientData.blsEmail ? "Yes" : "No");

    // التحقق من وجود خطأ في الإيميل لإيقاف المحاولات
    const emailDoesNotExist = document.body.innerText.includes("Given Email does not exist");
    if (emailDoesNotExist) {
      console.warn("[LOGIN_SCRIPT] Email does not exist. Stopping auto-login.");
      // إرسال رسالة للخلفية لإيقاف البوت (بدلاً من localStorage)
      if (typeof chrome !== 'undefined' && chrome.runtime) {
          chrome.runtime.sendMessage({ action: "STOP_SCRIPT" });
      }
      return;
    }

    const domReady = () => new Promise(resolve => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', resolve);
      } else {
        resolve();
      }
    });

    async function login() {
      await domReady();
      
      const email = clientData.blsEmail;
      const password = clientData.blsPassword; // انتبه: في script.js الاسم هو blsPassword وليس password

      if (!email || !password) {
        console.error("[LOGIN_SCRIPT] Missing email or password!");
        return;
      }

      console.log("[LOGIN_SCRIPT] Filling credentials...");

      // استخدام jQuery إذا كان متاحاً في الصفحة، أو JS عادي كبديل
      if (typeof $ !== 'undefined') {
          $(":text:visible").val(email);
          $(":password:visible").val(password);
          $('#btnVerify').trigger("click");
      } else {
          // بديل JS عادي (أكثر أماناً)
          const emailInput = document.querySelector('input[type="text"]');
          const passInput = document.querySelector('input[type="password"]');
          const btn = document.getElementById('btnVerify');

          if (emailInput) emailInput.value = email;
          if (passInput) passInput.value = password;
          if (btn) btn.click();
      }
    }

    async function loginCaptcha() {
      await domReady();
      const password = clientData.blsPassword;
      
      if (typeof $ !== 'undefined') {
          $(":password:visible").val(password);
      } else {
          const passInput = document.querySelector('input[type="password"]');
          if (passInput) passInput.value = password;
      }
      console.log("[LOGIN_SCRIPT] Password filled, waiting for captcha...");
    }

    const { pathname } = location;

    // التوجيه حسب الصفحة
    if (/^\/MAR\/account\/login\/?$/i.test(pathname)) {
        login();
    } else if (/^\/MAR\/newcaptcha\/logincaptcha\/?$/i.test(pathname)) {
        loginCaptcha();
    }

  } catch (scriptError) {
    console.error('[LOGIN_SCRIPT] Error:', scriptError);
  }
})();