const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// Get all users
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, username, email, created_at FROM users');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create (register) a simple user
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Plain text for simplicity, in a real app this should be hashed
        const [result] = await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
            [username, email, password]
        );
        res.json({ id: result.insertId, username, email });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Username or email already exists' });
        }
        res.status(500).json({ error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await pool.query(
            'SELECT id, username, email FROM users WHERE email = ? AND password_hash = ?',
            [email, password]
        );
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
