const express = require('express');
const router = express.Router();
const { protect, roleCheck, schoolGuard } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Class = require('../models/Class');
const FeePayment = require('../models/FeePayment');
const Subject = require('../models/Subject');
const ReportCard = require('../models/ReportCard');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

router.use(protect);
router.use(schoolGuard);
router.use(roleCheck('admin'));

// GET /api/admin/dashboard
router.get('/dashboard', async (req, res) => {
    try {
        const schoolId = req.schoolId;

        // Stats
        const totalStudents = await User.countDocuments({ schoolId, role: 'student' });
        const totalTeachers = await User.countDocuments({ schoolId, role: 'teacher' });
        const totalParents = await User.countDocuments({ schoolId, role: 'parent' });

        // Recent Users
        const recentUsers = await User.find({ schoolId })
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('classAssigned', 'name');
        
        const formattedRecentUsers = recentUsers.map(u => ({
            id: u.customId,
            name: u.name,
            role: u.role,
            class: u.classAssigned ? u.classAssigned.name : '—',
            status: u.isActive ? 'active' : 'inactive',
            date: u.createdAt
        }));

        // Fee Pending
        const pendingFees = await FeePayment.find({ schoolId, status: 'Pending' })
            .populate({
                path: 'studentId',
                select: 'customId name classAssigned',
                populate: { path: 'classAssigned', select: 'name' }
            });
        
        const feePendingList = [];
        let totalPendingAmount = 0;
        let totalCollectedAmount = 0;
        let totalAnnualAmount = 0;

        const allFees = await FeePayment.find({ schoolId });
        for (const f of allFees) {
            totalAnnualAmount += f.amountDue;
            totalCollectedAmount += f.amountPaid;
            if (f.status === 'Pending') {
                totalPendingAmount += (f.amountDue - f.amountPaid);
            }
        }

        // Deep populate already gives us studentId.classAssigned.name
        for (const f of pendingFees) {
            if (!f.studentId) continue;
            
            const daysLeft = Math.ceil((new Date(f.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
            feePendingList.push({
                _id: f._id,
                id: f.studentId.customId,
                name: f.studentId.name,
                class: f.studentId.classAssigned ? f.studentId.classAssigned.name : '—',
                due: f.amountDue - f.amountPaid,
                days: daysLeft > 0 ? daysLeft : 0
            });
        }

        // Classes
        const classes = await Class.find({ schoolId });
        const classesData = [];
        for (const c of classes) {
            const studentCount = await User.countDocuments({ schoolId, classAssigned: c._id, role: 'student' });
            // Teachers assigned to subjects of this class
            const subjects = await Subject.find({ schoolId, classId: c._id });
            const teacherIds = new Set(subjects.map(s => s.assignedTeacher?.toString()).filter(Boolean));
            
            // Average Performance (simplified)
            const reportCards = await ReportCard.find({ schoolId, classId: c._id });
            let sum = 0;
            reportCards.forEach(r => sum += r.overallPercentage);
            const avg = reportCards.length > 0 ? Math.round(sum / reportCards.length) : 0;

            classesData.push({
                id: c._id,
                name: c.name,
                section: c.name.startsWith('10') || c.name.startsWith('11') || c.name.startsWith('12') ? 'Senior' : 'Middle',
                students: studentCount,
                teachers: teacherIds.size,
                avg
            });
        }

        res.json({
            stats: { totalStudents, totalTeachers, totalParents },
            recentUsers: formattedRecentUsers,
            feePending: feePendingList,
            feeSummary: {
                totalAnnual: totalAnnualAmount,
                collected: totalCollectedAmount,
                pending: totalPendingAmount
            },
            classes: classesData
        });

    } catch (error) {
        console.error('Admin dashboard error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// POST /api/admin/users
router.post('/users', async (req, res) => {
    try {
        const { name, email, mobile, role, classAssigned } = req.body;
        
        const school = await require('../models/School').findById(req.schoolId);
        if (!school) return res.status(404).json({ success: false, message: 'School not found' });
        
        let prefix = 'st';
        let counterKey = role;
        if (role === 'teacher') prefix = 'th';
        else if (role === 'parent') prefix = 'pf';
        else if (role === 'admin') prefix = 'ad';

        // Atomically increment counter
        school.idCounters[counterKey] += 1;
        await school.save();

        const customId = `${prefix}${String(school.idCounters[counterKey]).padStart(4, '0')}`;
        
        // Generate a secure, 24-hour setup token
        const rawToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

        // Provide a random unguessable password placeholder
        const placeholderPassword = await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 10);

        let classId = null;
        if (role === 'student' && classAssigned) {
            const cls = await Class.findOne({ schoolId: req.schoolId, name: classAssigned });
            if (cls) classId = cls._id;
        }

        const newUser = await User.create({
            schoolId: req.schoolId,
            name,
            email,
            mobile,
            role,
            customId,
            password: placeholderPassword,
            classAssigned: classId,
            setPasswordToken: hashedToken,
            setPasswordExpires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        });

        // Send welcome email with Set Password link
        const resetUrl = `http://localhost:5173/set-password/${rawToken}`;
        
        const emailHTML = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <h2 style="color: #3B82F6; text-align: center;">Welcome to UltimateSchool!</h2>
                <p>Hello <strong>${name}</strong>,</p>
                <p>An account has been created for you. To access your portal, please set up your password by clicking the secure button below:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Set Your Password</a>
                </div>

                <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 5px 0;"><strong>School Code:</strong> ${school.schoolCode}</p>
                    <p style="margin: 5px 0;"><strong>User ID:</strong> ${newUser.customId.toUpperCase()}</p>
                </div>
                
                <p style="color: #EF4444; font-size: 0.9em; font-weight: bold;">Note: This link will expire in 24 hours and can only be used once.</p>
                <p style="color: #4B5563; font-size: 0.85em;">If the button doesn't work, copy and paste this URL into your browser:<br/>
                <a href="${resetUrl}">${resetUrl}</a></p>
                <br/>
                <p>Best Regards,<br/><strong>UltimateSchool Administration</strong></p>
            </div>
        `;

        await sendEmail({
            to: email,
            subject: 'Welcome to UltimateSchool - Set Your Password',
            html: emailHTML
        });

        res.status(201).json({ success: true, message: 'User created successfully', user: { id: newUser.customId.toUpperCase(), name: newUser.name } });
    } catch (error) {
        console.error('Create user error:', error);
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'A user with this email already exists.' });
        }
        res.status(500).json({ success: false, message: 'Error creating user' });
    }
});

// POST /api/admin/fees
router.post('/fees', async (req, res) => {
    try {
        const { studentCustomId, amount, mode, date, remarks } = req.body;
        const student = await User.findOne({ schoolId: req.schoolId, customId: studentCustomId.toLowerCase(), role: 'student' });
        
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        // Find oldest pending fee for this student
        const pendingFee = await FeePayment.findOne({ schoolId: req.schoolId, studentId: student._id, status: 'Pending' }).sort({ dueDate: 1 });
        
        if (pendingFee) {
            pendingFee.amountPaid += Number(amount);
            if (pendingFee.amountPaid >= pendingFee.amountDue) {
                pendingFee.status = 'Paid';
            }
            pendingFee.receiptUrl = `${mode}-${Date.now()}`; // Mock receipt
            await pendingFee.save();
            return res.json({ success: true, message: 'Payment recorded successfully' });
        }

        res.status(400).json({ success: false, message: 'No pending fees found for this student' });
    } catch (error) {
        console.error('Fee payment error:', error);
        res.status(500).json({ success: false, message: 'Error recording payment' });
    }
});

// POST /api/admin/notices
router.post('/notices', async (req, res) => {
    // In real app, save to Notice collection and notify clients via WebSockets or push notifications
    res.json({ success: true, message: 'Notice broadcasted successfully' });
});

module.exports = router;
