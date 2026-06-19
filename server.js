const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing data & sessions
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'prikart_secret_key_2026',
    resave: false,
    saveUninitialized: true
}));

// Temporary Database in Server Memory (Professional structure)
const usersDatabase = {
    student: [],
    teacher: [],
    parent: []
};

// Serve static HTML/CSS/JS seamlessly
app.use(express.static(path.join(__dirname)));

// API: Handle Self-Registration (Sign Up)
app.post('/api/register', async (req, res) => {
    const { fullName, email, password, role } = req.body;
    
    if (!usersDatabase[role]) {
        return res.status(400).json({ success: false, message: "Invalid role selected." });
    }

    // Check if user already exists
    const userExists = usersDatabase[role].find(u => u.email === email);
    if (userExists) {
        return res.json({ success: false, message: "Email already registered in this portal!" });
    }

    // Encrypt password securely (Professional Standard)
    const hashedPassword = await bcrypt.hash(password, 10);
    
    usersDatabase[role].push({
        id: Date.now(),
        fullName,
        email,
        password: hashedPassword
    });

    res.json({ success: true, message: "Registration successful! You can now login." });
});

// API: Handle Authentication (Login)
app.post('/api/login', async (req, res) => {
    const { email, password, role } = req.body;

    if (!usersDatabase[role]) {
        return res.status(400).json({ success: false, message: "Invalid role." });
    }

    const user = usersDatabase[role].find(u => u.email === email);
    if (!user) {
        return res.json({ success: false, message: "User not found! Please register first." });
    }

    // Compare encrypted password
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
        req.session.user = { id: user.id, name: user.fullName, role: role };
        res.json({ success: true, message: `Welcome ${user.fullName}!`, redirect: '/dashboard' });
    } else {
        res.json({ success: false, message: "Incorrect password! Please try again." });
    }
});

// Dashboard Route
app.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }
    res.send(`
        <div style="font-family: sans-serif; text-align: center; padding: 50px; background: #f1f5f9; min-height: 100vh;">
            <div style="background: white; padding: 30px; border-radius: 20px; display: inline-block; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
                <h1 style="color: #4f46e5;">✨ PRIKART SYSTEM DASHBOARD</h1>
                <p style="font-size: 18px;">Hello, <strong>${req.session.user.name}</strong>!</p>
                <p style="color: #64748b;">Logged in successfully as: <span style="background: #e0e7ff; color: #4f46e5; padding: 3px 10px; border-radius: 12px; font-size: 14px; font-weight: bold;">${req.session.user.role.toUpperCase()}</span></p>
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
                <a href="/logout" style="background: #ef4444; color: white; padding: 10px 20px; text-decoration: none; border-radius: 10px; font-weight: bold;">Logout</a>
            </div>
        </div>
    `);
});

// Logout Route
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Start Professional Server instance
app.listen(PORT, () => {
    console.log(`[SERVER] Prikart Public School is running live on http://localhost:${PORT}`);
});