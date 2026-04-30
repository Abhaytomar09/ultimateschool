const express = require('express');
const router  = express.Router();
const School  = require('../models/School');

/**
 * GET /api/schools/search?q=<query>
 *
 * Public endpoint — no auth required.
 * Returns up to 8 schools matching the query by name OR schoolCode.
 * Only exposes: schoolCode + name  (never contactEmail, idCounters, etc.)
 *
 * Security:
 *  - Results are limited to 8 documents.
 *  - Only two safe fields are projected.
 *  - Query is sanitised (special regex chars escaped).
 */
router.get('/search', async (req, res) => {
    const raw = (req.query.q || '').trim();

    if (!raw || raw.length < 2) {
        return res.json([]);        // require at least 2 chars before hitting DB
    }

    // Escape special regex characters to prevent ReDoS
    const safe = raw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    try {
        const schools = await School.find(
            {
                $or: [
                    { name:       { $regex: safe, $options: 'i' } },
                    { schoolCode: { $regex: safe, $options: 'i' } },
                ],
            },
            'schoolCode name'   // project only safe fields
        ).limit(8).lean();

        // Return a clean, minimal shape
        const results = schools.map(s => ({
            schoolCode: s.schoolCode,
            name:       s.name,
        }));

        return res.json(results);

    } catch (error) {
        console.error('[schools/search]', error.message);
        return res.status(500).json({ message: 'Search failed. Please try again.' });
    }
});

module.exports = router;
