const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// Get swaps involving a specific user
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const [rows] = await pool.query(`
            SELECT sw.*, 
                   s.name as skill_name, 
                   s.type as skill_type,
                   ru.username as requester_name, 
                   ru.email as requester_email,
                   pu.username as provider_name,
                   pu.email as provider_email
            FROM swaps sw
            JOIN skills s ON sw.skill_id = s.id
            JOIN users ru ON sw.requester_id = ru.id
            JOIN users pu ON sw.provider_id = pu.id
            WHERE sw.requester_id = ? OR sw.provider_id = ?
            ORDER BY sw.created_at DESC
        `, [userId, userId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Request a swap
router.post('/', async (req, res) => {
    const { requester_id, provider_id, skill_id } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO swaps (requester_id, provider_id, skill_id) VALUES (?, ?, ?)',
            [requester_id, provider_id, skill_id]
        );
        res.json({ id: result.insertId, status: 'pending' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update swap status
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await pool.query('UPDATE swaps SET status = ? WHERE id = ?', [status, id]);
        res.json({ success: true, id, status });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
