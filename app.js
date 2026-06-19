// ========================================================
// PRIKART PUBLIC SCHOOL - UPGRADED DATABASE LOGIC ENGINE
// ========================================================

let selectedRole = 'student';
let currentSessionUser = null;

// DOM Targets Extraction
const tabLogin = document.getElementById('tabLogin');
const tabRegister = document.getElementById('tabRegister');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const feedbackBox = document.getElementById('feedbackBox');

const landingLayer = document.getElementById('landingLayer');
const dashboardLayer = document.getElementById('dashboardLayer');

// Dashboard UI Targets
const dashName = document.getElementById('dashName');
const dashRole = document.getElementById('dashRole');
const cardName = document.getElementById('cardName');
const cardRoleBadge = document.getElementById('cardRoleBadge');
const cardUid = document.getElementById('cardUid');
const cardParentName = document.getElementById('cardParentName');
const cardPhone = document.getElementById('cardPhone');
const cardClassRoll = document.getElementById('cardClassRoll');
const cardPhoto = document.getElementById('cardPhoto');

// Config Modification Forms
const updateProfileForm = document.getElementById('updateProfileForm');
const inputParent = document.getElementById('inputParent');
const inputPhone = document.getElementById('inputPhone');
const inputPhotoUrl = document.getElementById('inputPhotoUrl');
const logoutBtn = document.getElementById('logoutBtn');

// Initialize Storage Schema
if (!localStorage.getItem('prikart_users')) {
    localStorage.setItem('prikart_users', JSON.stringify({ student: [], teacher: [], parent: [] }));
}

// Form Presentation Tabs Toggling Engine
if(tabLogin && tabRegister) {
    tabLogin.addEventListener('click', () => {
        tabLogin.className = "flex-1 pb-3 text-indigo-600 border-b-2 border-indigo-600 text-center cursor-pointer font-bold";
        tabRegister.className = "flex-1 pb-3 text-slate-400 text-center cursor-pointer hover:text-slate-600";
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        clearFeedback();
    });

    tabRegister.addEventListener('click', () => {
        tabRegister.className = "flex-1 pb-3 text-indigo-600 border-b-2 border-indigo-600 text-center cursor-pointer font-bold";
        tabLogin.className = "flex-1 pb-3 text-slate-400 text-center cursor-pointer hover:text-slate-600";
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        clearFeedback();
    });
}

// Role Domain Selector Mapping
document.querySelectorAll('.role-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.role-btn').forEach(b => {
            b.className = "role-btn py-2 text-xs font-bold rounded-lg border border-slate-200 bg-slate-50 text-slate-600 transition-all cursor-pointer";
        });
        btn.className = "role-btn py-2 text-xs font-bold rounded-lg border border-indigo-600 bg-indigo-50 text-indigo-700 transition-all cursor-pointer";
        selectedRole = btn.getAttribute('data-role');
    });
});

function showFeedback(msg, isSuccess) {
    if(!feedbackBox) return;
    feedbackBox.classList.remove('hidden');
    feedbackBox.className = `mt-4 p-3 rounded-xl text-center text-xs font-semibold ${isSuccess ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`;
    feedbackBox.innerText = msg;
}

function clearFeedback() { 
    if(feedbackBox) feedbackBox.classList.add('hidden'); 
}

// NEW: Full Database Registration Engine
if(registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Extracting all the database input values filled by the user
        const fullName = document.getElementById('regName').value.trim();
        const parentName = document.getElementById('regParentName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const phone = document.getElementById('regPhone').value.trim();
        const className = document.getElementById('regClass').value.trim();
        const rollNo = document.getElementById('regRoll').value.trim();
        const photoUrl = document.getElementById('regPhotoUrl').value.trim();
        const password = document.getElementById('regPassword').value;

        let db = JSON.parse(localStorage.getItem('prikart_users'));
        const userExists = db[selectedRole].find(u => u.email === email);

        if (userExists) {
            showFeedback("Registration Error: This email already holds a database node!", false);
            return;
        }

        // Generating a high-level Unique Student UID Code
        const uniqueUid = "PPS-" + Math.floor(10000 + Math.random() * 90000);
        
        // Saving the complete structured payload package into database list
        db[selectedRole].push({ 
            fullName, 
            parentName,
            email, 
            phone,
            className,
            rollNo,
            photoUrl,
            password,
            uid: uniqueUid
        });
        
        localStorage.setItem('prikart_users', JSON.stringify(db));
        showFeedback("Database Record Created! Switch to 'Secure Login' tab to authenticate.", true);
        registerForm.reset();
    });
}

// Authentication Logic Engine
if(loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        let db = JSON.parse(localStorage.getItem('prikart_users'));
        const user = db[selectedRole].find(u => u.email === email && u.password === password);

        if (user) {
            currentSessionUser = { role: selectedRole, email: email };
            showFeedback("Access Granted! Fetching complete profile schema matrix...", true);
            
            setTimeout(() => {
                landingLayer.classList.add('hidden');
                dashboardLayer.classList.remove('hidden');
                renderDashboardView(user);
            }, 1000);
        } else {
            showFeedback("Access Denied! Credentials or role domain context mismatch.", false);
        }
    });
}

// Mapping the Complete Pre-Filled Database onto the Profile Card
function renderDashboardView(user) {
    if(!dashboardLayer) return;
    dashName.innerText = user.fullName.toUpperCase();
    cardName.innerText = user.fullName.toUpperCase();
    dashRole.innerText = `${selectedRole} Workspace Context`;
    cardRoleBadge.innerText = `${selectedRole} Domain Portal`;
    
    // Injecting populated records safely into fields
    cardUid.innerText = user.uid;
    cardParentName.innerText = user.parentName;
    cardPhone.innerText = user.phone;
    cardClassRoll.innerText = `${user.className} / Roll No: ${user.rollNo}`;
    cardPhoto.src = user.photoUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150";

    // Set inside modifier inputs automatically
    inputParent.value = user.parentName;
    inputPhone.value = user.phone;
    inputPhotoUrl.value = user.photoUrl;
}

// Live Profile Records Modifier Engine
if(updateProfileForm) {
    updateProfileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!currentSessionUser) return;

        let db = JSON.parse(localStorage.getItem('prikart_users'));
        let roleList = db[currentSessionUser.role];
        let userIndex = roleList.findIndex(u => u.email === currentSessionUser.email);

        if (userIndex !== -1) {
            roleList[userIndex].parentName = inputParent.value.trim();
            roleList[userIndex].phone = inputPhone.value.trim();
            roleList[userIndex].photoUrl = inputPhotoUrl.value.trim();

            localStorage.setItem('prikart_users', JSON.stringify(db));
            renderDashboardView(roleList[userIndex]);
            alert("🔒 Database Record Overwritten and Saved Successfully!");
        }
    });
}

// Logout Link Trigger
if(logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        currentSessionUser = null;
        dashboardLayer.classList.add('hidden');
        landingLayer.classList.remove('hidden');
        loginForm.reset();
        clearFeedback();
    });
}
