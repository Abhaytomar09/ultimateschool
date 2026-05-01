const express = require('express');
const router = express.Router();
const { protect, roleCheck } = require('../middleware/authMiddleware');
const { seedDemoData } = require('../utils/demoSeeder');

// POST /api/demo/seed – admin‑only endpoint to generate a full demo dataset
router.post('/seed', protect, roleCheck('admin'), async (req, res) => {
    try {
        await seedDemoData();
        return res.json({ message: 'Demo data seeded successfully.' });
    } catch (err) {
        console.error('[demo/seed]', err);
        return res.status(500).json({ message: 'Demo seeding failed.', error: err.message });
    }
});

module.exports = router;
