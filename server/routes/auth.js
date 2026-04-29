const express = require('express');
const router = express.Router();
const { registerSchoolAndAdmin, registerUser, loginUser } = require('../controllers/authController');
const { protect, roleCheck } = require('../middleware/authMiddleware');

router.post('/register-school', registerSchoolAndAdmin);
router.post('/login', loginUser);

// Only admins can register other users
router.post('/register-user', protect, roleCheck('admin'), registerUser);

module.exports = router;
