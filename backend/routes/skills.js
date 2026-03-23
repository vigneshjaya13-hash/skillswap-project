const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// Get all skills with user info
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT s.*, u.username, u.email 
            FROM skills s 
            JOIN users u ON s.user_id = u.id
            ORDER BY s.created_at DESC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user specific skills
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const [rows] = await pool.query('SELECT * FROM skills WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a new skill
router.post('/', async (req, res) => {
    const { user_id, name, description, category, type, resource_link } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO skills (user_id, name, description, category, type, resource_link) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id, name, description, category, type, resource_link || null]
        );
        res.json({ id: result.insertId, user_id, name, description, category, type, resource_link });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
