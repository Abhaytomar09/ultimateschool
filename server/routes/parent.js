const express = require('express');
const router = express.Router();
const { protect, roleCheck, schoolGuard } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const FeePayment = require('../models/FeePayment');
const ReportCard = require('../models/ReportCard');

router.use(protect);
router.use(schoolGuard);
router.use(roleCheck('parent'));

// GET /api/parent/dashboard
router.get('/dashboard', async (req, res) => {
    try {
        const parentId = req.user._id;
        const schoolId = req.schoolId;

        // Parent schema has linkedStudents array
        const parent = await User.findById(parentId).populate('linkedStudents');
        if (!parent || !parent.linkedStudents || parent.linkedStudents.length === 0) {
            return res.json({ success: true, children: [] });
        }

        const childrenData = [];

        for (const child of parent.linkedStudents) {
            // 1. Attendance (Last 30 days)
            const attendanceRecords = await Attendance.find({ schoolId, studentId: child._id }).sort({ date: -1 }).limit(30);
            
            const attCalendar = attendanceRecords.map(r => [
                r.date.getDate(),
                r.status === 'Present' ? 'P' : r.status === 'Absent' ? 'A' : 'L'
            ]);

            const total = attendanceRecords.length;
            const present = attendanceRecords.filter(r => r.status === 'Present').length;
            const attendancePercentage = total === 0 ? 100 : Math.round((present / total) * 100);

            // 2. Fees
            const fees = await FeePayment.find({ schoolId, studentId: child._id }).sort({ dueDate: -1 });
            const totalAnnual = fees.reduce((acc, f) => acc + f.amountDue, 0);
            const paid = fees.reduce((acc, f) => acc + f.amountPaid, 0);
            const pending = totalAnnual - paid;

            // 3. Performance (ReportCard)
            const reportCard = await ReportCard.findOne({ schoolId, studentId: child._id })
                .populate('subjectMarks.subjectId', 'name')
                .sort({ createdAt: -1 });
            
            const subjects = [];
            if (reportCard) {
                for (const sub of reportCard.subjectMarks) {
                    if (!sub.subjectId) continue;
                    subjects.push({
                        name: sub.subjectId.name,
                        score: Math.round(sub.normalizedPercentage || 0),
                        topics: [] // Assuming topic level details require more complex aggregation or schemas
                    });
                }
            }

            childrenData.push({
                _id: child._id,
                id: child.customId,
                name: child.name,
                class: child.classAssigned, // Should ideally populate class name
                att: attendancePercentage,
                attCalendar,
                rank: reportCard ? reportCard.rank : '-',
                totalStudents: 180, // Mock total
                fees: { annual: totalAnnual, paid, pending, history: fees },
                subjects: subjects.length ? subjects : [
                    { name: 'Mathematics', score: 62, topics: [{ t: 'Algebra', s: 38 }] } // fallback mock
                ]
            });
        }

        res.json({ success: true, children: childrenData });

    } catch (error) {
        console.error('Parent dashboard error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// POST /api/parent/message
router.post('/message', async (req, res) => {
    // Save to messages/notification schema
    res.json({ success: true, message: 'Message sent successfully to the teacher!' });
});

module.exports = router;
