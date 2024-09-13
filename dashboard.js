// استرجاع البيانات المخزنة أو إنشاء مصفوفة فارغة
let healthCases = JSON.parse(localStorage.getItem('healthCases')) || [];

// تهيئة الرسوم البيانية
let casesChart, gradeChart, diseaseChart;

// تحديث لوحة التحكم
function updateDashboard() {
    updateCharts();
    updateHealthList();
}

// تحديث الرسوم البيانية
function updateCharts() {
    updateCasesChart();
    updateGradeChart();
    updateDiseaseChart();
}

// تحديث الرسم البياني للحالات
function updateCasesChart() {
    const ctx = document.getElementById('casesChart').getContext('2d');
    const data = {
        labels: ['حرجة', 'متوسطة', 'بسيطة'],
        datasets: [{
            data: [
                healthCases.filter(c => c.severity === 'severe').length,
                healthCases.filter(c => c.severity === 'moderate').length,
                healthCases.filter(c => c.severity === 'mild').length
            ],
            backgroundColor: ['#e74c3c', '#f39c12', '#2ecc71']
        }]
    };
    
    if (casesChart) {
        casesChart.data = data;
        casesChart.update();
    } else {
        casesChart = new Chart(ctx, {
            type: 'pie',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: { position: 'bottom' }
            }
        });
    }
}

// تحديث الرسم البياني للصفوف
function updateGradeChart() {
    const ctx = document.getElementById('gradeChart').getContext('2d');
    const gradeData = [1, 2, 3, 4].map(grade => 
        healthCases.filter(c => c.grade == grade).length
    );
    
    const data = {
        labels: ['الصف الأول', 'الصف الثاني', 'الصف الثالث', 'الصف الرابع'],
        datasets: [{
            label: 'عدد الحالات',
            data: gradeData,
            backgroundColor: '#3498db'
        }]
    };
    
    if (gradeChart) {
        gradeChart.data = data;
        gradeChart.update();
    } else {
        gradeChart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true } }
            }
        });
    }
}

// تحديث الرسم البياني للأمراض
function updateDiseaseChart() {
    const ctx = document.getElementById('diseaseChart').getContext('2d');
    const diseaseCounts = {};
    healthCases.forEach(c => {
        diseaseCounts[c.condition] = (diseaseCounts[c.condition] || 0) + 1;
    });
    
    const sortedDiseases = Object.entries(diseaseCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    const data = {
        labels: sortedDiseases.map(d => d[0]),
        datasets: [{
            label: 'عدد الحالات',
            data: sortedDiseases.map(d => d[1]),
            backgroundColor: '#2ecc71'
        }]
    };
    
    if (diseaseChart) {
        diseaseChart.data = data;
        diseaseChart.update();
    } else {
        diseaseChart = new Chart(ctx, {
            type: 'horizontalBar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { x: { beginAtZero: true } }
            }
        });
    }
}

// تحديث قائمة الحالات الصحية
function updateHealthList() {
    const listElement = document.getElementById('healthList');
    listElement.innerHTML = '';
    
    const filteredCases = filterCases();
    
    filteredCases.forEach(caseItem => {
        const itemElement = document.createElement('div');
        itemElement.className = 'health-item';
        itemElement.innerHTML = `
            <div>
                <strong>${caseItem.name}</strong> - الصف ${caseItem.grade}/${caseItem.section}
                <br>الحالة: ${caseItem.condition}
                <br>الشدة: <span class="severity-${caseItem.severity}">${caseItem.severity}</span>
            </div>
            <div>
                <button onclick="editCase(${caseItem.id})"><i class="fas fa-edit"></i></button>
                <button onclick="deleteCase(${caseItem.id})"><i class="fas fa-trash"></i></button>
            </div>
        `;
        listElement.appendChild(itemElement);
    });
}

// فلترة الحالات حسب المعايير المحددة
function filterCases() {
    const grade = document.getElementById('gradeFilter').value;
    const section = document.getElementById('sectionFilter').value;
    const severity = document.getElementById('severityFilter').value;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    return healthCases.filter(caseItem => 
        (!grade || caseItem.grade == grade) &&
        (!section || caseItem.section == section) &&
        (!severity || caseItem.severity === severity) &&
        (caseItem.name.toLowerCase().includes(searchTerm) || 
         caseItem.condition.toLowerCase().includes(searchTerm))
    );
}

// إضافة أو تحديث حالة صحية
function addOrUpdateCase(e) {
    e.preventDefault();
    const form = e.target;
    const caseData = {
        id: form.caseId.value || Date.now(),
        name: form.studentName.value,
        grade: form.grade.value,
        section: form.section.value,
        condition: form.condition.value,
        severity: form.severity.value,
        action: form.action.value
    };

    const existingIndex = healthCases.findIndex(c => c.id == caseData.id);
    if (existingIndex !== -1) {
        healthCases[existingIndex] = caseData;
    } else {
        healthCases.push(caseData);
    }

    localStorage.setItem('healthCases', JSON.stringify(healthCases));
    updateDashboard();
    closeModal();
    showNotification('تم حفظ الحالة بنجاح');
}

// تحرير حالة صحية
function editCase(id) {
    const caseItem = healthCases.find(c => c.id == id);
    if (caseItem) {
        document.getElementById('modalTitle').textContent = 'تعديل حالة صحية';
        document.getElementById('caseId').value = caseItem.id;
        document.getElementById('studentName').value = caseItem.name;
        document.getElementById('grade').value = caseItem.grade;
        document.getElementById('section').value = caseItem.section;
        document.getElementById('condition').value = caseItem.condition;
        document.getElementById('severity').value = caseItem.severity;
        document.getElementById('action').value = caseItem.action;
        openModal();
    }
}

// حذف حالة صحية
function deleteCase(id) {
    if (confirm('هل أنت متأكد من حذف هذه الحالة؟')) {
        healthCases = healthCases.filter(c => c.id != id);
        localStorage.setItem('healthCases', JSON.stringify(healthCases));
        updateDashboard();
        showNotification('تم حذف الحالة بنجاح');
    }
}

// فتح النافذة المنبثقة
function openModal() {
    document.getElementById('addEditModal').style.display = 'block';
}

// إغلاق النافذة المنبثقة
function closeModal() {
    document.getElementById('addEditModal').style.display = 'none';
    document.getElementById('addEditForm').reset();
    document.getElementById('caseId').value = '';
    document.getElementById('modalTitle').textContent = 'إضافة حالة صحية جديدة';
}

// عرض إشعار
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#2ecc71';
    notification.style.color = 'white';
    notification.style.padding = '10px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '1000';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// تصدير البيانات
function exportData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(healthCases));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "health_cases.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    showNotification('تم تصدير البيانات بنجاح');
}

// استيراد البيانات
function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);
                healthCases = importedData;
                localStorage.setItem('healthCases', JSON.stringify(healthCases));
                updateDashboard();
                showNotification('تم استيراد البيانات بنجاح');
            } catch (error) {
                console.error('Error importing data:', error);
                showNotification('حدث خطأ أثناء استيراد البيانات');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// إضافة مستمعي الأحداث
document.addEventListener('DOMContentLoaded', function() {
    updateDashboard();

    document.getElementById('gradeFilter').addEventListener('change', updateDashboard);
    document.getElementById('sectionFilter').addEventListener('change', updateDashboard);
    document.getElementById('severityFilter').addEventListener('change', updateDashboard);
    document.getElementById('searchInput').addEventListener('input', updateDashboard);

    document.getElementById('addCaseBtn').addEventListener('click', () => {
        document.getElementById('modalTitle').textContent = 'إضافة حالة صحية جديدة';
        openModal();
    });

    document.getElementById('addEditForm').addEventListener('submit', addOrUpdateCase);

    document.querySelector('.close').addEventListener('click', closeModal);

    document.getElementById('exportDataBtn').addEventListener('click', exportData);
    document.getElementById('importDataBtn').addEventListener('click', importData);

    window.onclick = function(event) {
        if (event.target == document.getElementById('addEditModal')) {
            closeModal();
        }
    }
});

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
                text: `https://${window.location.hostname}/class.html?grade=${grade}&section=${section}`,
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
