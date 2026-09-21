const studentForm   = document.getElementById('studentForm');
const studentName    = document.getElementById('studentName');
const studentId      = document.getElementById('studentId');
const studentDept    = document.getElementById('studentDept');
const studentStatus  = document.getElementById('studentStatus');

const studentList    = document.getElementById('studentList');
const emptyState     = document.getElementById('emptyState');

const totalCount     = document.getElementById('totalCount');
const activeCount    = document.getElementById('activeCount');
const inactiveCount  = document.getElementById('inactiveCount');

const searchInput    = document.getElementById('searchInput');
const filterTabs     = document.getElementById('filterTabs');

const darkModeToggle = document.getElementById('darkModeToggle');
const modeIcon       = document.getElementById('modeIcon');
const modeLabel      = document.getElementById('modeLabel');


const filterButtons = document.querySelectorAll('.filter-btn');


let students = [];


let currentFilter = 'all';
let currentSearch = '';


studentForm.addEventListener('submit', function (event) {
    event.preventDefault();


    const name = studentName.value.trim();
    const id   = studentId.value.trim();
    const dept = studentDept.value.trim();
    const status = studentStatus.value;

    // Basic validation — don't add empty rows.
    if (!name || !id || !dept) {
        alert('Please fill in student name, ID, and department.');
        return;
    }


    students.push({ name, id, dept, status });


    studentForm.reset();

    renderStudents();
    updateStats();
});


function createStudentCard(student) {

    const li = document.createElement('li');
    li.className = 'student-card';


    li.setAttribute('data-status', student.status);
    li.setAttribute('data-name', student.name.toLowerCase());
    li.setAttribute('data-id', student.id.toLowerCase());

    const info = document.createElement('div');
    info.className = 'student-info';

    const nameEl = document.createElement('h3');
    nameEl.textContent = student.name;

    const metaEl = document.createElement('p');
    metaEl.textContent = `${student.id} • ${student.dept}`;

    info.appendChild(nameEl);
    info.appendChild(metaEl);

    const actions = document.createElement('div');
    actions.className = 'student-actions';

    const badge = document.createElement('span');

    badge.classList.add('status-badge', student.status);
    badge.textContent = student.status === 'active' ? 'Active' : 'Inactive';

    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'toggle-btn';
    toggleBtn.type = 'button';
    toggleBtn.textContent = 'Toggle Status';

    toggleBtn.addEventListener('click', function () {
        const target = students.find(s => s.id === student.id);
        target.status = target.status === 'active' ? 'inactive' : 'active';
        renderStudents();
        updateStats();
    });

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.type = 'button';
    removeBtn.textContent = 'Remove';

    removeBtn.addEventListener('click', function () {
        students = students.filter(s => s.id !== student.id);

        renderStudents();
        updateStats();
    });

    actions.appendChild(badge);
    actions.appendChild(toggleBtn);
    actions.appendChild(removeBtn);

    li.appendChild(info);
    li.appendChild(actions);

    return li;
}


function renderStudents() {

    studentList.textContent = '';

    const visible = students.filter(function (s) {
        const matchesFilter = currentFilter === 'all' || s.status === currentFilter;
        const matchesSearch =
            s.name.toLowerCase().includes(currentSearch) ||
            s.id.toLowerCase().includes(currentSearch);
        return matchesFilter && matchesSearch;
    });

    visible.forEach(function (student) {
        const card = createStudentCard(student);
        studentList.appendChild(card);
    });

    emptyState.classList.toggle('hidden', visible.length > 0);
    studentList.classList.toggle('hidden', visible.length === 0);
}

function updateStats() {
    const total = students.length;
    const active = students.filter(s => s.status === 'active').length;
    const inactive = total - active;


    totalCount.textContent = total;
    activeCount.textContent = active;
    inactiveCount.textContent = inactive;
}


searchInput.addEventListener('input', function () {
    currentSearch = searchInput.value.trim().toLowerCase();
    renderStudents();
});


filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {

        currentFilter = btn.getAttribute('data-filter');

        filterButtons.forEach(function (b) {
            b.classList.remove('active');
        });
        btn.classList.add('active');

        renderStudents();
    });
});


darkModeToggle.addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');

    const isDark = document.body.classList.contains('dark-mode');
    modeIcon.textContent = isDark ? '☀️' : '🌙';
    modeLabel.textContent = isDark ? 'Light Mode' : 'Dark Mode';
});

renderStudents();
updateStats();