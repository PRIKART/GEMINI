// ========================================================
// PRIKART PUBLIC SCHOOL - ENTERPRISE NODE BACKEND SERVER
// ========================================================

const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Data parsing settings & session configurations
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'prikart_central_crypto_key_2026',
    resave: false,
    saveUninitialized: true
}));

// Professional In-Memory Database Schema Structure
const serverDatabase = {
    student: [],
    teacher: [],
    parent: []
};

// Serve static assets (HTML/JS files)
app.use(express.static(path.join(__dirname)));

// 📝 API: FULL ONBOARDING DATABASE REGISTRATION
app.post('/api/register', async (req, res) => {
    const { fullName, parentName, email, phone, className, rollNo, photoUrl, password, role } = req.body;
    
    if (!serverDatabase[role]) {
        return res.status(400).json({ success: false, message: "Invalid system domain selected." });
    }

    // Check if unique email node already exists
    const userExists = serverDatabase[role].find(u => u.email === email);
    if (userExists) {
        return res.json({ success: false, message: "Security Warning: Email record already exists in database!" });
    }

    // Encrypt password securely for compliance (Bcrypt encryption standard)
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Auto-generate Unique institutional UID token
    const uniqueUid = "PPS-" + Math.floor(10000 + Math.random() * 90000);

    // Commit full-scale structured object matrix into server database
    serverDatabase[role].push({
        uid: uniqueUid,
        fullName,
        parentName,
        email,
        phone,
        className,
        rollNo,
        photoUrl: photoUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
        password: hashedPassword
    });

    res.json({ success: true, message: "Database Record Committed! Switch to login tab to authenticate." });
});

// 🔑 API: AUTHENTICATION SECURE GATEWAY (LOGIN)
app.post('/api/login', async (req, res) => {
    const { email, password, role } = req.body;

    if (!serverDatabase[role]) {
        return res.status(400).json({ success: false, message: "Invalid access domain configuration." });
    }

    // Find user record match
    const user = serverDatabase[role].find(u => u.email === email);
    if (!user) {
        return res.json({ success: false, message: "Access Denied: Record not found in central ledger." });
    }

    // De-crypt and compare safe password tokens
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
        // Assign secure server session tracking variables
        req.session.user = { 
            uid: user.uid,
            name: user.fullName, 
            parentName: user.parentName,
            email: user.email,
            phone: user.phone,
            className: user.className,
            rollNo: user.rollNo,
            photoUrl: user.photoUrl,
            role: role 
        };
        res.json({ success: true, message: "Verification Approved! Synchronizing profile tokens...", user: req.session.user });
    } else {
        res.json({ success: false, message: "Authentication Failure: Secure key string mismatch." });
    }