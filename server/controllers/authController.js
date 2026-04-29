const User = require('../models/User');
const School = require('../models/School');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const registerSchoolAndAdmin = async (req, res) => {
    const { schoolName, address, contactEmail, adminName, adminEmail, adminPassword } = req.body;

    try {
        const schoolExists = await School.findOne({ name: schoolName });
        if (schoolExists) return res.status(400).json({ message: 'School already exists' });

        const userExists = await User.findOne({ email: adminEmail });
        if (userExists) return res.status(400).json({ message: 'Admin email already exists' });

        const school = await School.create({
            name: schoolName,
            address,
            contactEmail,
            idCounters: { admin: 1 }
        });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        const admin = await User.create({
            schoolId: school._id,
            customId: 'ad0001',
            name: adminName,
            email: adminEmail,
            password: hashedPassword,
            role: 'admin'
        });

        res.status(201).json({
            schoolId: school._id,
            userId: admin._id,
            customId: admin.customId.toUpperCase(),
            role: admin.role,
            token: generateToken(admin._id)
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const registerUser = async (req, res) => {
    // Only admins can register teachers/students/parents for now
    const { role, name, email, password, parentType, linkedStudents } = req.body;
    const schoolId = req.user.schoolId;

    try {
        const school = await School.findById(schoolId);
        if (!school) return res.status(404).json({ message: 'School not found' });

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        let prefix = '';
        if (role === 'student') prefix = 'st';
        else if (role === 'teacher') prefix = 'th';
        else if (role === 'parent') {
            prefix = parentType === 'mother' ? 'pm' : (parentType === 'father' ? 'pf' : 'pa');
        } else if (role === 'admin') {
            prefix = 'ad';
        } else {
            return res.status(400).json({ message: 'Invalid role' });
        }

        school.idCounters[role] += 1;
        await school.save();

        const customId = `${prefix}${String(school.idCounters[role]).padStart(4, '0')}`;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            schoolId,
            customId,
            name,
            email,
            password: hashedPassword,
            role,
            linkedStudents: role === 'parent' ? linkedStudents : undefined
        });

        res.status(201).json({
            userId: user._id,
            customId: user.customId.toUpperCase(),
            name: user.name,
            email: user.email,
            role: user.role
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                userId: user._id,
                schoolId: user.schoolId,
                customId: user.customId.toUpperCase(),
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    registerSchoolAndAdmin,
    registerUser,
    loginUser
};
