// استرجاع البيانات من localStorage أو إنشاء مصفوفة فارغة
let healthCases = JSON.parse(localStorage.getItem('healthCases')) || [];

// عرض الحالات الصحية
function displayHealthCases() {
    const tableBody = document.getElementById('healthCasesList');
    tableBody.innerHTML = '';
    healthCases.forEach((caseItem, index) => {
        const row = `
            <tr>
                <td>${caseItem.name}</td>
                <td>${caseItem.grade}</td>
                <td>${caseItem.condition}</td>
                <td>${caseItem.severity}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deleteCase(${index})">
                        <i class="bi bi-trash"></i> حذف
                    </button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// إضافة حالة جديدة
document.getElementById('addCaseForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const newCase = {
        name: document.getElementById('studentName').value,
        grade: document.getElementById('grade').value,
        condition: document.getElementById('healthCondition').value,
        severity: document.getElementById('severity').value
    };
    healthCases.push(newCase);
    localStorage.setItem('healthCases', JSON.stringify(healthCases));
    displayHealthCases();
    this.reset();
    document.getElementById('addCaseModal').querySelector('.btn-close').click();
});

// حذف حالة
function deleteCase(index) {
    if(confirm('هل أنت متأكد من حذف هذه الحالة؟')) {
        healthCases.splice(index, 1);
        localStorage.setItem('healthCases', JSON.stringify(healthCases));
        displayHealthCases();
    }
}

// البحث في الحالات
document.getElementById('searchInput').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredCases = healthCases.filter(caseItem => 
        caseItem.name.toLowerCase().includes(searchTerm) ||
        caseItem.condition.toLowerCase().includes(searchTerm)
    );
    displayFilteredCases(filteredCases);
});

// عرض الحالات المفلترة
function displayFilteredCases(cases) {
    const tableBody = document.getElementById('healthCasesList');
    tableBody.innerHTML = '';
    cases.forEach((caseItem, index) => {
        const row = `
            <tr>
                <td>${caseItem.name}</td>
                <td>${caseItem.grade}</td>
                <td>${caseItem.condition}</td>
                <td>${caseItem.severity}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deleteCase(${index})">
                        <i class="bi bi-trash"></i> حذف
                    </button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// تحميل الحالات عند بدء التطبيق
displayHealthCases();
