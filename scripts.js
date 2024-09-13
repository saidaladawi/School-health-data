// استرجاع البيانات المخزنة أو إنشاء مصفوفة فارغة
let healthCases = JSON.parse(localStorage.getItem('healthCases')) || [];

// تحديث قائمة الفصول بناءً على الصف المختار
function updateSections() {
    const grade = document.getElementById('grade').value;
    const sectionSelect = document.getElementById('section');
    sectionSelect.innerHTML = '<option value="">اختر الفصل</option>';
    
    if (grade) {
        for (let i = 1; i <= 6; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `الفصل ${i}`;
            sectionSelect.appendChild(option);
        }
    }
}

// عرض الحالات الصحية
function renderCases() {
    const casesList = document.getElementById('casesList');
    casesList.innerHTML = '';
    healthCases.forEach((caseItem, index) => {
        const caseElement = document.createElement('div');
        caseElement.className = 'case-item';
        caseElement.innerHTML = `
            <h3>${caseItem.name}</h3>
            <p>الصف: ${caseItem.grade} - الفصل: ${caseItem.section}</p>
            <p>الحالة الصحية: ${caseItem.condition}</p>
            <p>الشدة: <span class="severity-${caseItem.severity}">${caseItem.severity}</span></p>
            <p>الإجراء: ${caseItem.action}</p>
            <button onclick="editCase(${index})">تعديل</button>
            <button onclick="deleteCase(${index})">حذف</button>
        `;
        casesList.appendChild(caseElement);
    });
    updateDashboard();
}

// تحديث لوحة المعلومات
function updateDashboard() {
    document.getElementById('totalCases').textContent = healthCases.length;
    document.getElementById('severeCases').textContent = healthCases.filter(c => c.severity === 'severe').length;
    document.getElementById('moderateCases').textContent = healthCases.filter(c => c.severity === 'moderate').length;
    document.getElementById('mildCases').textContent = healthCases.filter(c => c.severity === 'mild').length;
}

// إضافة أو تحديث حالة صحية
function addOrUpdateCase(e) {
    e.preventDefault();
    const caseData = {
        name: document.getElementById('studentName').value,
        grade: document.getElementById('grade').value,
        section: document.getElementById('section').value,
        condition: document.getElementById('condition').value,
        severity: document.getElementById('severity').value,
        action: document.getElementById('action').value
    };

    const editIndex = e.target.dataset.editIndex;
    if (editIndex !== undefined) {
        healthCases[editIndex] = caseData;
    } else {
        healthCases.push(caseData);
    }

    localStorage.setItem('healthCases', JSON.stringify(healthCases));
    renderCases();
    generateClassPages();
    e.target.reset();
    delete e.target.dataset.editIndex;
}

// تعديل حالة صحية
function editCase(index) {
    const caseItem = healthCases[index];
    document.getElementById('studentName').value = caseItem.name;
    document.getElementById('grade').value = caseItem.grade;
    updateSections();
    document.getElementById('section').value = caseItem.section;
    document.getElementById('condition').value = caseItem.condition;
    document.getElementById('severity').value = caseItem.severity;
    document.getElementById('action').value = caseItem.action;
    
    document.getElementById('caseForm').dataset.editIndex = index;
}

// حذف حالة صحية
function deleteCase(index) {
    if (confirm('هل أنت متأكد من حذف هذه الحالة؟')) {
        healthCases.splice(index, 1);
        localStorage.setItem('healthCases', JSON.stringify(healthCases));
        renderCases();
        generateClassPages();
    }
}

// توليد صفحات HTML للصفوف
function generateClassPages() {
    for (let grade = 1; grade <= 4; grade++) {
        for (let section = 1; section <= 6; section++) {
            const classCases = healthCases.filter(c => c.grade == grade && c.section == section);
            const classHtml = `
                <!DOCTYPE html>
                <html lang="ar" dir="rtl">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>الحالات الصحية - الصف ${grade}/${section}</title>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; }
                        h1 { color: #3498db; }
                        .case-item { background-color: #f4f4f4; margin-bottom: 10px; padding: 10px; border-radius: 5px; }
                        .severity-mild { color: green; }
                        .severity-moderate { color: orange; }
                        .severity-severe { color: red; }
                    </style>
                </head>
                <body>
                    <h1>الحالات الصحية - الصف ${grade}/${section}</h1>
                    ${classCases.map(c => `
                        <div class="case-item">
                            <h3>${c.name}</h3>
                            <p>الحالة الصحية: ${c.condition}</p>
                            <p>الشدة: <span class="severity-${c.severity}">${c.severity}</span></p>
                            <p>الإجراء: ${c.action}</p>
                        </div>
                    `).join('')}
                </body>
                </html>
            `;
            
            // هنا يمكنك حفظ الـ HTML كملف أو إرساله إلى الخادم
            console.log(`Generated HTML for Class ${grade}/${section}`);
            // يمكنك استخدام API لحفظ الملف على الخادم هنا
        }
    }
}

// توليد رموز QR
function generateQRCodes() {
    const qrCodesContainer = document.getElementById('qrCodes');
    qrCodesContainer.innerHTML = '';
    for (let grade = 1; grade <= 4; grade++) {
        for (let section = 1; section <= 6; section++) {
            const qrDiv = document.createElement('div');
            qrDiv.className = 'qr-code';
            
            // إنشاء عنصر QR Code
            new QRCode(qrDiv, {
                text: `https://yourschool.com/class/${grade}/${section}`,
                width: 128,
                height: 128
            });
            
            // إضافة نص تحت رمز QR
            const label = document.createElement('p');
            label.textContent = `الصف ${grade}/${section}`;
            qrDiv.appendChild(label);
            
            qrCodesContainer.appendChild(qrDiv);
        }
    }
}

// تهيئة الصفحة
function initializePage() {
    renderCases();
    generateQRCodes();
    updateSections();
}

// ربط الأحداث
document.addEventListener('DOMContentLoaded', function() {
    initializePage();

    // ربط حدث تغيير الصف لتحديث الفصول
    document.getElementById('grade').addEventListener('change', updateSections);

    // ربط نموذج إضافة/تعديل الحالة
    document.getElementById('caseForm').addEventListener('submit', addOrUpdateCase);
});

// دالة لتحديث صفحة HTML لصف معين
function updateClassPage(grade, section) {
    const classCases = healthCases.filter(c => c.grade == grade && c.section == section);
    const classHtml = `
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>الحالات الصحية - الصف ${grade}/${section}</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; }
                h1 { color: #3498db; }
                .case-item { background-color: #f4f4f4; margin-bottom: 10px; padding: 10px; border-radius: 5px; }
                .severity-mild { color: green; }
                .severity-moderate { color: orange; }
                .severity-severe { color: red; }
            </style>
        </head>
        <body>
            <h1>الحالات الصحية - الصف ${grade}/${section}</h1>
            ${classCases.map(c => `
                <div class="case-item">
                    <h3>${c.name}</h3>
                    <p>الحالة الصحية: ${c.condition}</p>
                    <p>الشدة: <span class="severity-${c.severity}">${c.severity}</span></p>
                    <p>الإجراء: ${c.action}</p>
                </div>
            `).join('')}
        </body>
        </html>
    `;
    
    // هنا يمكنك إرسال الـ HTML إلى الخادم لحفظه كملف
    // مثال افتراضي باستخدام Fetch API (تحتاج إلى تنفيذ الجانب الخلفي)
    fetch('/update-class-page', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            grade: grade,
            section: section,
            html: classHtml
        })
    })
    .then(response => response.json())
    .then(data => console.log('Class page updated:', data))
    .catch((error) => console.error('Error:', error));
}

// تحديث جميع صفحات الصفوف
function updateAllClassPages() {
    for (let grade = 1; grade <= 4; grade++) {
        for (let section = 1; section <= 6; section++) {
            updateClassPage(grade, section);
        }
    }
}

// تعديل دالة addOrUpdateCase لتحديث صفحات الصفوف
function addOrUpdateCase(e) {
    e.preventDefault();
    const caseData = {
        name: document.getElementById('studentName').value,
        grade: document.getElementById('grade').value,
        section: document.getElementById('section').value,
        condition: document.getElementById('condition').value,
        severity: document.getElementById('severity').value,
        action: document.getElementById('action').value
    };

    const editIndex = e.target.dataset.editIndex;
    if (editIndex !== undefined) {
        healthCases[editIndex] = caseData;
    } else {
        healthCases.push(caseData);
    }

    localStorage.setItem('healthCases', JSON.stringify(healthCases));
    renderCases();
    updateClassPage(caseData.grade, caseData.section);
    e.target.reset();
    delete e.target.dataset.editIndex;
}

// تعديل دالة deleteCase لتحديث صفحات الصفوف
function deleteCase(index) {
    if (confirm('هل أنت متأكد من حذف هذه الحالة؟')) {
        const deletedCase = healthCases[index];
        healthCases.splice(index, 1);
        localStorage.setItem('healthCases', JSON.stringify(healthCases));
        renderCases();
        updateClassPage(deletedCase.grade, deletedCase.section);
    }
}

// إضافة دالة لتصدير البيانات
function exportData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(healthCases));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "health_cases.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

// إضافة دالة لاستيراد البيانات
function importData(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            healthCases = importedData;
            localStorage.setItem('healthCases', JSON.stringify(healthCases));
            renderCases();
            updateAllClassPages();
            alert('تم استيراد البيانات بنجاح');
        } catch (error) {
            console.error('Error importing data:', error);
            alert('حدث خطأ أثناء استيراد البيانات');
        }
    };
    reader.readAsText(file);
}

// ربط وظائف التصدير والاستيراد (يجب إضافة العناصر المقابلة في HTML)
document.getElementById('exportButton').addEventListener('click', exportData);
document.getElementById('importInput').addEventListener('change', importData);
