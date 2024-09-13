// استرجاع البيانات المخزنة أو إنشاء مصفوفة فارغة
let healthCases = JSON.parse(localStorage.getItem('healthCases')) || [];

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
    updateSummary();
}

function updateSummary() {
    document.getElementById('totalCases').textContent = healthCases.length;
    const severeCases = healthCases.filter(caseItem => caseItem.severity === 'severe').length;
    document.getElementById('severeCases').textContent = severeCases;
}

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
    document.getElementById('addCaseForm').style.display = 'none';
    e.target.reset();
}

function editCase(index) {
    const caseItem = healthCases[index];
    document.getElementById('studentName').value = caseItem.name;
    document.getElementById('grade').value = caseItem.grade;
    updateSections();
    document.getElementById('section').value = caseItem.section;
    document.getElementById('condition').value = caseItem.condition;
    document.getElementById('severity').value = caseItem.severity;
    document.getElementById('action').value = caseItem.action;
    
    const form = document.getElementById('addCaseForm');
    form.style.display = 'block';
    form.dataset.editIndex = index;
}

function deleteCase(index) {
    if (confirm('هل أنت متأكد من حذف هذه الحالة؟')) {
        healthCases.splice(index, 1);
        localStorage.setItem('healthCases', JSON.stringify(healthCases));
        renderCases();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    renderCases();
    updateSections();

    document.getElementById('addCaseBtn').addEventListener('click', function() {
        document.getElementById('addCaseForm').style.display = 'block';
    });

    document.getElementById('addCaseForm').addEventListener('submit', addOrUpdateCase);

    document.getElementById('grade').addEventListener('change', updateSections);
});
