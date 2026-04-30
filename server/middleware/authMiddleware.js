const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * protect — validates JWT and attaches the full user object to req.user.
 * schoolId and schoolCode are also available directly from the token payload
 * so downstream middleware never needs an extra School DB lookup.
 */
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch user, exclude password
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                return res.status(401).json({ message: 'User not found. Token invalid.' });
            }

            // Attach school context from JWT (avoids extra DB call)
            req.schoolId   = decoded.schoolId;
            req.schoolCode = decoded.schoolCode;

            next();
        } catch (error) {
            console.error('[protect middleware]', error.message);
            return res.status(401).json({ message: 'Not authorized. Token failed.' });
        }
    } else {
        return res.status(401).json({ message: 'Not authorized. No token provided.' });
    }
};

/**
 * roleCheck — ensures the logged-in user has one of the allowed roles.
 * Usage: roleCheck('admin', 'teacher')
 */
const roleCheck = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Access denied. Required role(s): ${roles.join(', ')}.`,
            });
        }
        next();
    };
};

/**
 * schoolGuard — ensures every query is scoped to the user's school.
 * Attaches req.schoolId from JWT if not already set.
 * Use after protect() on any route that queries school-specific data.
 */
const schoolGuard = (req, res, next) => {
    if (!req.schoolId) {
        return res.status(403).json({ message: 'School context missing from token.' });
    }
    next();
};

module.exports = { protect, roleCheck, schoolGuard };
