// ========================================================
// PRIKART PUBLIC SCHOOL - CENTRAL LOGIC MANAGEMENT ENGINE
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

// Dashboard Elements UI Targets
const dashName = document.getElementById('dashName');
const dashRole = document.getElementById('dashRole');
const cardName = document.getElementById('cardName');
const cardRoleBadge = document.getElementById('cardRoleBadge');
const cardUid = document.getElementById('cardUid');
const cardParentName = document.getElementById('cardParentName');
const cardPhone = document.getElementById('cardPhone');
const cardPhoto = document.getElementById('cardPhoto');

// Config Modification Forms
const updateProfileForm = document.getElementById('updateProfileForm');
const inputParent = document.getElementById('inputParent');
const inputPhone = document.getElementById('inputPhone');
const inputPhotoUrl = document.getElementById('inputPhotoUrl');
const logoutBtn = document.getElementById('logoutBtn');

// Initialize LocalStorage Database schema if empty
if (!localStorage.getItem('prikart_users')) {
    localStorage.setItem('prikart_users', JSON.stringify({ student: [], teacher: [], parent: [] }));
}

// Form Presentation Tabs Toggling Engine
if(tabLogin && tabRegister) {
    tabLogin.addEventListener('click', () => {
        tabLogin.className = "flex-1 pb-3 text-indigo-600 border-b-2 border-indigo-600 text-center cursor-pointer";
        tabRegister.className = "flex-1 pb-3 text-slate-400 text-center cursor-pointer hover:text-slate-600";
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        clearFeedback();
    });

    tabRegister.addEventListener('click', () => {
        tabRegister.className = "flex-1 pb-3 text-indigo-600 border-b-2 border-indigo-600 text-center cursor-pointer";
        tabLogin.className = "flex-1 pb-3 text-slate-400 text-center cursor-pointer hover:text-slate-600";
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        clearFeedback();
    });
}

// Role Domain Click Selection Handler
document.querySelectorAll('.role-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.role-btn').forEach(b => {
            b.className = "role-btn py-2 text-xs font-bold rounded-lg border border-slate-200 bg-slate-50 text-slate-600 transition-all cursor-pointer";
        });
        btn.className = "role-btn py-2 text-xs font-bold rounded-lg border border-indigo-600 bg-indigo-50 text-indigo-700 transition-all cursor-pointer";
        selectedRole = btn.getAttribute('data-role');
    });
});

// Feedback Utility Triggers
function showFeedback(msg, isSuccess) {
    if(!feedbackBox) return;
    feedbackBox.classList.remove('hidden');
    feedbackBox.className = `mt-4 p-3 rounded-xl text-center text-xs font-semibold ${isSuccess ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`;
    feedbackBox.innerText = msg;
}

function clearFeedback() { 
    if(feedbackBox) feedbackBox.classList.add('hidden'); 
}

// Secure Self-Registration Operation Handler
if(registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const fullName = document.getElementById('regName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;

        let db = JSON.parse(localStorage.getItem('prikart_users'));
        const userExists = db[selectedRole].find(u => u.email === email);

        if (userExists) {
            showFeedback("Security Alert: Data allocation mismatch, entity already configured!", false);
            return;
        }

        // Generate dynamic Unique ID tokens
        const uniqueUid = "PPS-" + Math.floor(10000 + Math.random() * 90000);
        db[selectedRole].push({ 
            fullName, 
            email, 
            password,
            uid: uniqueUid,
            parentName: "Not Configured",
            phone: "Not Configured",
            photoUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
        });
        
        localStorage.setItem('prikart_users', JSON.stringify(db));
        showFeedback("Identity Node Created! Directing to Secure Login tab.", true);
        registerForm.reset();
    });
}

// Authentication Framework Deployment 
if(loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        let db = JSON.parse(localStorage.getItem('prikart_users'));
        const user = db[selectedRole].find(u => u.email === email && u.password === password);

        if (user) {
            currentSessionUser = { role: selectedRole, email: email };
            showFeedback("Session Approved! Syncing structures context...", true);
            
            setTimeout(() => {
                landingLayer.classList.add('hidden');
                dashboardLayer.classList.remove('hidden');
                renderDashboardView(user);
            }, 1000);
        } else {
            showFeedback("Verification denied! Key tokens or role selection mismatch.", false);
        }
    });
}

// Core Render Logic: Maps DB variables cleanly onto DOM elements
function renderDashboardView(user) {
    if(!dashboardLayer) return;
    dashName.innerText = user.fullName.toUpperCase();
    cardName.innerText = user.fullName.toUpperCase();
    dashRole.innerText = `${selectedRole} Secure Context`;
    cardRoleBadge.innerText = `${selectedRole} Access Frame`;
    
    cardUid.innerText = user.uid;
    cardParentName.innerText = user.parentName;
    cardPhone.innerText = user.phone;
    cardPhoto.src = user.photoUrl;

    // Input values parsing presets
    inputParent.value = user.parentName === "Not Configured" ? "" : user.parentName;
    inputPhone.value = user.phone === "Not Configured" ? "" : user.phone;
    inputPhotoUrl.value = user.photoUrl.includes("unsplash.com") ? "" : user.photoUrl;
}

// Client-Side Profile Real-time Data Mutation Engine
if(updateProfileForm) {
    updateProfileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!currentSessionUser) return;

        let db = JSON.parse(localStorage.getItem('prikart_users'));
        let roleList = db[currentSessionUser.role];
        let userIndex = roleList.findIndex(u => u.email === currentSessionUser.email);

        if (userIndex !== -1) {
            // Overwrite node contexts directly
            roleList[userIndex].parentName = inputParent.value.trim() || "Not Configured";
            roleList[userIndex].phone = inputPhone.value.trim() || "Not Configured";
            roleList[userIndex].photoUrl = inputPhotoUrl.value.trim() || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150";

            localStorage.setItem('prikart_users', JSON.stringify(db));
            
            // Instantly re-trigger clean UI update
            renderDashboardView(roleList[userIndex]);
            alert("🔒 Central Ledger Records Updated Successfully!");
        }
    });
}

// Safe Session De-allocation Link
if(logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        currentSessionUser = null;
        dashboardLayer.classList.add('hidden');
        landingLayer.classList.remove('hidden');
        loginForm.reset();
        clearFeedback();
    });
}