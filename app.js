let selectedRole = 'student';

// Elements Extraction
const tabLogin = document.getElementById('tabLogin');
const tabRegister = document.getElementById('tabRegister');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const feedbackBox = document.getElementById('feedbackBox');
const landingLayer = document.getElementById('landingLayer');
const dashboardLayer = document.getElementById('dashboardLayer');

// Dashboard UI Selectors
const dashName = document.getElementById('dashName');
const dashRole = document.getElementById('dashRole');
const cardName = document.getElementById('cardName');
const cardRoleBadge = document.getElementById('cardRoleBadge');
const cardUid = document.getElementById('cardUid');
const cardParentName = document.getElementById('cardParentName');
const cardPhone = document.getElementById('cardPhone');
const cardClassRoll = document.getElementById('cardClassRoll');
const cardPhoto = document.getElementById('cardPhoto');

// Form Modifiers
const updateProfileForm = document.getElementById('updateProfileForm');
const inputParent = document.getElementById('inputParent');
const inputPhone = document.getElementById('inputPhone');
const inputPhotoUrl = document.getElementById('inputPhotoUrl');
const logoutBtn = document.getElementById('logoutBtn');

// Toggles Tabs
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

// Domain Roles Selection Links
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

function clearFeedback() { if(feedbackBox) feedbackBox.classList.add('hidden'); }

// Communicate Registration Data to Node Server API
if(registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            fullName: document.getElementById('regName').value.trim(),
            parentName: document.getElementById('regParentName').value.trim(),
            email: document.getElementById('regEmail').value.trim(),
            phone: document.getElementById('regPhone').value.trim(),
            className: document.getElementById('regClass').value.trim(),
            rollNo: document.getElementById('regRoll').value.trim(),
            photoUrl: document.getElementById('regPhotoUrl').value.trim(),
            password: document.getElementById('regPassword').value,
            role: selectedRole
        };

        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        showFeedback(data.message, data.success);
        if(data.success) registerForm.reset();
    });
}

// Pass Credentials to Server for Validation Checks
if(loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            email: document.getElementById('loginEmail').value.trim(),
            password: document.getElementById('loginPassword').value,
            role: selectedRole
        };

        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        
        if (data.success) {
            showFeedback(data.message, true);
            setTimeout(() => {
                landingLayer.classList.add('hidden');
                dashboardLayer.classList.remove('hidden');
                renderDashboardView(data.user);
            }, 1000);
        } else {
            showFeedback(data.message, false);
        }
    });
}

function renderDashboardView(user) {
    if(!dashboardLayer) return;
    dashName.innerText = user.name.toUpperCase();
    cardName.innerText = user.name.toUpperCase();
    dashRole.innerText = `${user.role} Cloud Session`;
    cardRoleBadge.innerText = `${user.role} Domain Portal`;
    
    cardUid.innerText = user.uid;
    cardParentName.innerText = user.parentName;
    cardPhone.innerText = user.phone;
    cardClassRoll.innerText = `${user.className} / Roll No: ${user.rollNo}`;
    cardPhoto.src = user.photoUrl;

    inputParent.value = user.parentName;
    inputPhone.value = user.phone;
    inputPhotoUrl.value = user.photoUrl;
}

// Push Updates back into Server Database Model Row
if(updateProfileForm) {
    updateProfileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            parentName: inputParent.value.trim(),
            phone: inputPhone.value.trim(),
            photoUrl: inputPhotoUrl.value.trim()
        };

        const response = await fetch('/api/update-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        if(data.success) {
            renderDashboardView(data.user);
            alert("🔒 Server Master Database Record Overwritten and Saved!");
        }
    });
}

// Session Disconnect Route Link
if(logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        await fetch('/api/logout');
        dashboardLayer.classList.add('hidden');
        landingLayer.classList.remove('hidden');
        loginForm.reset();
        clearFeedback();
    });
}