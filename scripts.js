// تخزين البيانات
let healthCases = JSON.parse(localStorage.getItem('healthCases')) || [];

// إضافة حالة صحية جديدة
document.getElementById('health-case-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const newCase = {
        id: Date.now(),
        name: document.getElementById('student-name').value,
        class: document.getElementById('class').value,
        condition: document.getElementById('health-condition').value,
        severity: document.getElementById('severity').value,
        action: document.getElementById('action').value
    };
    healthCases.push(newCase);
    saveAndRenderCases();
    this.reset();
});

// حفظ الحالات وإعادة عرضها
function saveAndRenderCases() {
    localStorage.setItem('healthCases', JSON.stringify(healthCases));
    renderCases();
}

// عرض الحالات الصحية
function renderCases() {
    const tableBody = document.querySelector('#health-cases-table tbody');
    tableBody.innerHTML = '';
    healthCases.forEach(case => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${case.name}</td>
            <td>${case.class}</td>
            <td>${case.condition}</td>
            <td>${case.severity}</td>
            <td>${case.action}</td>
            <td>
                <button onclick="editCase(${case.id})">تعديل</button>
                <button onclick="deleteCase(${case.id})">حذف</button>
            </td>
        `;
    });
}

// توليد روابط QR
function generateQRCodes() {
    const qrCodesContainer = document.getElementById('qr-codes');
    qrCodesContainer.innerHTML = '';
    for (let i = 1; i <= 4; i++) {
        const qrCode = new QRCode(qrCodesContainer, {
            text: `https://yourwebsite.com/class.html?id=${i}`,
            width: 128,
            height: 128
        });
        const label = document.createElement('p');
        label.textContent = `الصف ${i}`;
        qrCodesContainer.appendChild(label);
    }
}

// تحميل البيانات عند فتح الصفحة
renderCases();
generateQRCodes();

// وظائف إضافية للتعديل والحذف (يجب تنفيذها)
function editCase(id) {
    // قم بتنفيذ وظيفة التعديل هنا
}

function deleteCase(id) {
    // قم بتنفيذ وظيفة الحذف هنا
}
