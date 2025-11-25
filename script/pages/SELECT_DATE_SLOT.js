(async () => {
    console.clear();
    console.log("%c🚀 القناص V6: الوضع الديناميكي (بدون IDs)...", "color:cyan; font-size:18px");

    // 1. إيقاف اللودر المزعج
    window.OnAppointmentdateChange = function() { return false; };
    window.ShowLoader = function() {};
    $(".preloader, .global-overlay").hide();

    const token = $('input[name="__RequestVerificationToken"]').val();
    const rawData = $("#Data").val(); 

    if (!token || !rawData) return alert("❌ البيانات غير موجودة.");

    while (true) {
        // 2. تحديد أول يوم أخضر
        let targetDate = null;
        try {
            if (typeof window.availDates !== "undefined" && window.availDates.ad) {
                const firstGreen = window.availDates.ad.find(d => d.AppointmentDateType === 0);
                if (firstGreen) targetDate = firstGreen.DateText;
            }
        } catch (err) {}

        if (!targetDate) {
            console.log("%c😴 جاري البحث...", "color:gray");
            await new Promise(r => setTimeout(r, 1500)); 
            continue;
        }

        console.log(`🎯 الهدف: ${targetDate}`);

        // 3. جلب السلوتات (محاكاة دقيقة للموقع)
        const encodedData = encodeURIComponent(rawData);
        const correctUrl = `/MAR/appointment/GetAvailableSlotsByDate?data=${encodedData}&appointmentDate=${targetDate}&loc=RABAT`;

        let validSlot = null;
        try {
            const res = await $.ajax({
                url: correctUrl,
                type: "POST",
                headers: { "RequestVerificationToken": token }
            });

            if (res.success && res.data && res.data.length > 0) {
                validSlot = res.data.find(s => s.Count > 0);
            }
        } catch (e) {
            await new Promise(r => setTimeout(r, 3000));
            continue;
        }

        // 4. التثبيت (الحل لمشكلة Dynamic IDs)
        if (validSlot) {
            console.log(`🔥 الموعد المتاح: ${validSlot.Name}`, "color:lime; font-size:22px");

            // أ) وضع التاريخ في أي مربع تاريخ ظاهر
            const datePickerInput = $("input[data-role='datepicker']:visible, .k-datepicker:visible input").first();
            const kendoDate = datePickerInput.data("kendoDatePicker");
            if (kendoDate) kendoDate.value(targetDate);
            else datePickerInput.val(targetDate);

            // ب) البحث عن *كل* القوائم المنسدلة (Dropdowns) في الصفحة
            // لا نعتمد على ID، بل نعتمد على خاصية data-role="dropdownlist"
            let injectedCount = 0;
            
            $("input[data-role='dropdownlist']").each(function() {
                const kendoList = $(this).data("kendoDropDownList");

                // شرط: أن تكون القائمة موجودة + (ظاهرة أو مفعلة)
                // نتجاوز القوائم المخفية تماماً، ونركز على التي يراها المستخدم
                if (kendoList && $(this).closest(".k-dropdown").is(":visible")) {
                    
                    console.log("💉 تم حقن الموعد في قائمة ديناميكية...");

                    // 1. إنشاء مصدر بيانات يحتوي فقط على موعدنا
                    const sniperDataSource = new kendo.data.DataSource({
                        data: [ { Id: validSlot.Id, Name: validSlot.Name } ]
                    });

                    // 2. فرض البيانات
                    kendoList.setDataSource(sniperDataSource);
                    
                    // 3. الاختيار
                    kendoList.select(0); 
                    kendoList.value(validSlot.Id);
                    
                    // 4. تحديث النص الظاهري (لحل مشكلة المربع الفارغ)
                    kendoList.text(validSlot.Name); 
                    
                    // 5. تفعيل التغيير ليحس الموقع
                    kendoList.trigger("change");

                    injectedCount++;
                }
            });

            if (injectedCount > 0) {
                new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg').play();
                console.log("%c✅ تم الاختيار بنجاح!", "color:yellow; background:green; font-size:20px");
                alert(`🎉 مبروك!\nالموعد: ${targetDate}\nالساعة: ${validSlot.Name}`);
                return; 
            } else {
                console.log("⚠️ لم يتم العثور على قائمة منسدلة ظاهرة! تأكد من تكبير النافذة.");
            }
        } else {
            // إذا اليوم متاح لكن الساعات ممتلئة
             await new Promise(r => setTimeout(r, 1000)); 
        }
    }
})();