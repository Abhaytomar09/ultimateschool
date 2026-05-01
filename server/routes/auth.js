const express = require('express');
const router = express.Router();
const {
    registerSchoolAndAdmin,
    registerUser,
    loginUser,
    getSchoolByCode,
    setPassword,
} = require('../controllers/authController');
const { protect, roleCheck } = require('../middleware/authMiddleware');

// ── Public Routes ──────────────────────────────────────────────────────────────
// Register a new school + its first admin account
router.post('/register-school', registerSchoolAndAdmin);

// Multi-tenant login: { schoolCode, userId, password }
router.post('/login', loginUser);

// Lookup school name by code (used by returning-user UI)
router.get('/school/:code', getSchoolByCode);

// Set Password using emailed token
router.post('/set-password/:token', setPassword);

// ── Protected Routes (Admin only) ─────────────────────────────────────────────
// Register teachers / students / parents under the admin's school
router.post('/register-user', protect, roleCheck('admin'), registerUser);

module.exports = router;
