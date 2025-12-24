const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('./db.js');
const router = express.Router();

// Signup endpoint
router.post('/signup', async (req, res) => {
    let { username, email, password } = req.body;
    if (!username || !email || !password)
        return res.json({ success: false, message: "All fields required" });

    const usernameClean = username.trim().toLowerCase();

    try {
        const [users] = await db.execute("SELECT id FROM users WHERE username=? OR email=?", [usernameClean, email]);
        if (users.length > 0)
            return res.json({ success: false, message: "Username or email already exists" });

        const hashed = await bcrypt.hash(password, 10);
        await db.execute(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            [usernameClean, email, hashed]
        );
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, message: "Database error" });
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    let { username, password } = req.body;
    if (!username || !password)
        return res.json({ success: false, message: "All fields required" });

    const usernameClean = username.trim().toLowerCase();

    try {
        const [users] = await db.execute("SELECT * FROM users WHERE username=?", [usernameClean]);
        if (users.length === 0)
            return res.json({ success: false, message: "Invalid credentials" });

        const user = users[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match)
            return res.json({ success: false, message: "Invalid credentials" });

        res.json({ success: true, username: user.username });
    } catch (err) {
        res.json({ success: false, message: "Database error" });
    }
});

module.exports = router;