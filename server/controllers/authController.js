const User = require('../models/User');
const School = require('../models/School');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Generate JWT that embeds userId, schoolId, schoolCode and role.
 * This lets every protected route validate the school without an extra DB call.
 */
const generateToken = (user, schoolCode) => {
    return jwt.sign(
        {
            id:         user._id,
            schoolId:   user.schoolId,
            schoolCode: schoolCode,
            role:       user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
};

/**
 * Detect role from ID prefix (case-insensitive).
 * ST → student | TH → teacher | PF/PM → parent | AD → admin
 */
const detectRoleFromId = (customId) => {
    const prefix = customId.toLowerCase().slice(0, 2);
    const map = { st: 'student', th: 'teacher', pf: 'parent', pm: 'parent', ad: 'admin' };
    return map[prefix] || null;
};

// ─── Register School + First Admin ────────────────────────────────────────────

const registerSchoolAndAdmin = async (req, res) => {
    const { schoolName, schoolCode, address, contactEmail, adminName, adminEmail, adminPassword } = req.body;

    if (!schoolName || !schoolCode || !address || !adminName || !adminEmail || !adminPassword) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    try {
        // Prevent duplicate school codes
        const codeExists = await School.findOne({ schoolCode: schoolCode.toUpperCase() });
        if (codeExists) {
            return res.status(400).json({ success: false, message: 'School code already in use. Choose a different code.' });
        }

        // Prevent duplicate school names
        const nameExists = await School.findOne({ name: schoolName });
        if (nameExists) {
            return res.status(400).json({ success: false, message: 'A school with this name already exists.' });
        }

        // Prevent duplicate admin email (globally unique)
        const adminExists = await User.findOne({ email: adminEmail.toLowerCase() });
        if (adminExists) {
            return res.status(400).json({ success: false, message: 'Admin email already registered.' });
        }

        const school = await School.create({
            schoolCode: schoolCode.toUpperCase(),
            name: schoolName,
            address,
            contactEmail,
            idCounters: { admin: 1, student: 0, teacher: 0, parent: 0 }
        });

        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        const admin = await User.create({
            schoolId: school._id,
            customId: 'ad0001',
            name: adminName,
            email: adminEmail.toLowerCase(),
            password: hashedPassword,
            role: 'admin'
        });

        const token = generateToken(admin, school.schoolCode);

        return res.status(201).json({
            success: true,
            message: 'School registered successfully.',
            schoolId:   school._id,
            schoolCode: school.schoolCode,
            schoolName: school.name,
            userId:     admin._id,
            customId:   admin.customId.toUpperCase(),
            name:       admin.name,
            role:       admin.role,
            token,
        });

    } catch (error) {
        console.error('[registerSchoolAndAdmin]', error);
        return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
    }
};

// ─── Register User (Admin-only) ───────────────────────────────────────────────

const registerUser = async (req, res) => {
    const { role, name, email, password, parentType, linkedStudents } = req.body;
    const schoolId = req.user.schoolId;   // from JWT via protect middleware

    if (!role || !name || !email || !password) {
        return res.status(400).json({ success: false, message: 'name, email, password and role are required.' });
    }

    try {
        const school = await School.findById(schoolId);
        if (!school) return res.status(404).json({ success: false, message: 'School not found.' });

        // Email must be globally unique
        const userExists = await User.findOne({ email: email.toLowerCase() });
        if (userExists) return res.status(400).json({ success: false, message: 'Email already registered.' });

        // Build prefix
        let prefix = '';
        let counterKey = role;
        if (role === 'student')       prefix = 'st';
        else if (role === 'teacher')  prefix = 'th';
        else if (role === 'parent') {
            prefix = parentType === 'mother' ? 'pm' : 'pf';
            counterKey = 'parent';
        } else if (role === 'admin')  prefix = 'ad';
        else return res.status(400).json({ success: false, message: 'Invalid role.' });

        // Atomically increment counter
        school.idCounters[counterKey] += 1;
        await school.save();

        const customId = `${prefix}${String(school.idCounters[counterKey]).padStart(4, '0')}`;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            schoolId,
            customId,
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role,
            linkedStudents: role === 'parent' ? linkedStudents : undefined
        });

        return res.status(201).json({
            success: true,
            userId:   user._id,
            customId: user.customId.toUpperCase(),
            name:     user.name,
            email:    user.email,
            role:     user.role,
        });

    } catch (error) {
        console.error('[registerUser]', error);
        return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
    }
};

// ─── Login  ───────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/login
 * Body: { schoolCode, userId, password }
 *
 * Multi-tenant: always validate schoolCode + userId together.
 * Never search by userId alone — that's the security contract.
 */
const loginUser = async (req, res) => {
    const { schoolCode, userId, password } = req.body;

    // Basic field validation
    if (!schoolCode || !userId || !password) {
        return res.status(400).json({ success: false, message: 'schoolCode, userId and password are required.' });
    }

    try {
        // Step 1 — Find school by its human-readable code
        const school = await School.findOne({ schoolCode: schoolCode.toUpperCase() });
        if (!school) {
            // Generic error — don't reveal whether school or user is wrong
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        // Step 2 — Find user scoped to this school only (compound query = no cross-tenant leak)
        const user = await User.findOne({
            schoolId: school._id,
            customId: userId.toLowerCase(),   // stored lowercase
        });

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        // Step 3 — Verify password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        // Step 4 — Role sanity check (ID prefix must match stored role)
        const detectedRole = detectRoleFromId(user.customId);
        if (detectedRole && detectedRole !== user.role) {
            // Shouldn't happen in production, but guards against data corruption
            console.warn(`Role mismatch for ${user.customId}: detected=${detectedRole}, stored=${user.role}`);
        }

        // Step 5 — Return token + safe user payload
        const token = generateToken(user, school.schoolCode);

        return res.json({
            success: true,
            token,
            userId:     user._id,
            schoolId:   school._id,
            schoolCode: school.schoolCode,
            schoolName: school.name,
            customId:   user.customId.toUpperCase(),
            name:       user.name,
            role:       user.role,
        });

    } catch (error) {
        console.error('[loginUser]', error);
        return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
    }
};

// ─── Lookup School by Code (for "returning user" school name display) ─────────

/**
 * GET /api/auth/school/:code
 * Returns { schoolCode, schoolName } — public endpoint, no auth required.
 * Frontend uses this to display "School: ABC Public School [Change]"
 */
const getSchoolByCode = async (req, res) => {
    try {
        const school = await School.findOne(
            { schoolCode: req.params.code.toUpperCase() },
            'schoolCode name contactEmail'
        );
        if (!school) return res.status(404).json({ success: false, message: 'School not found.' });
        return res.json({ success: true, schoolCode: school.schoolCode, schoolName: school.name });
    } catch (error) {
        console.error('[getSchoolByCode]', error);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

/**
 * POST /api/auth/set-password/:token
 * Validates the single-use token and sets the user's password.
 */
const setPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password || password.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
        }

        // Hash the incoming raw token to compare against DB
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Find user with this token and ensure it's not expired
        const user = await User.findOne({
            setPasswordToken: hashedToken,
            setPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Password setup link is invalid or has expired.' });
        }

        // Set new password
        user.password = await bcrypt.hash(password, 10);
        
        // Clear the token fields (single-use)
        user.setPasswordToken = undefined;
        user.setPasswordExpires = undefined;

        await user.save();

        res.json({ success: true, message: 'Password has been set successfully. You can now log in.' });

    } catch (error) {
        console.error('[setPassword]', error);
        res.status(500).json({ success: false, message: 'Server error. Please try again.' });
    }
};

module.exports = {
    registerSchoolAndAdmin,
    registerUser,
    loginUser,
    getSchoolByCode,
    setPassword,
};
