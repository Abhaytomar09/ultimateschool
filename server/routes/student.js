const express = require('express');
const router = express.Router();
const { protect, roleCheck, schoolGuard } = require('../middleware/authMiddleware');
const Timetable = require('../models/Timetable');
const Attendance = require('../models/Attendance');
const Assignment = require('../models/Assignment');
const FeePayment = require('../models/FeePayment');
const ReportCard = require('../models/ReportCard');

router.use(protect);
router.use(schoolGuard);
router.use(roleCheck('student'));

// GET /api/student/dashboard
router.get('/dashboard', async (req, res) => {
    try {
        const student = req.user;
        const schoolId = req.schoolId;
        const classId = student.classAssigned;

        // 1. Timetable for today
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const todayName = days[new Date().getDay()];
        
        let timetable = await Timetable.findOne({ schoolId, classId, dayOfWeek: todayName })
            .populate('periods.subjectId', 'name')
            .populate('periods.teacherId', 'name');

        // 2. Attendance % (mock past 30 days)
        const totalAttendance = await Attendance.countDocuments({ schoolId, studentId: student._id });
        const presentCount = await Attendance.countDocuments({ schoolId, studentId: student._id, status: 'Present' });
        const attendancePercentage = totalAttendance === 0 ? 100 : Math.round((presentCount / totalAttendance) * 100);

        // 3. Assignments
        const assignments = await Assignment.find({ schoolId, classId })
            .populate('subjectId', 'name')
            .populate('teacherId', 'name')
            .sort({ dueDate: 1 });

        const formattedAssignments = assignments.map(a => {
            const mySubmission = a.submissions.find(sub => sub.studentId.toString() === student._id.toString());
            let status = 'Pending';
            if (mySubmission) {
                status = mySubmission.marksAwarded !== undefined ? 'Graded' : 'Submitted';
            }
            return {
                _id: a._id,
                title: a.title,
                subject: a.subjectId.name,
                dueDate: a.dueDate,
                status: status,
                marksAwarded: mySubmission ? mySubmission.marksAwarded : null,
                teacher: a.teacherId.name
            };
        });

        // 4. Fees
        const fees = await FeePayment.find({ schoolId, studentId: student._id }).sort({ dueDate: -1 });

        // 5. Performance (ReportCard)
        const reportCard = await ReportCard.findOne({ schoolId, studentId: student._id })
            .populate('subjectMarks.subjectId', 'name')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            student: {
                name: student.name,
                customId: student.customId,
                classId: classId
            },
            todaySchedule: timetable ? timetable.periods : [],
            attendancePercentage,
            assignments: formattedAssignments,
            fees: fees,
            performance: reportCard
        });

    } catch (error) {
        console.error('Error fetching student dashboard:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// POST /api/student/assignment/:id/submit
router.post('/assignment/:id/submit', async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) return res.status(404).json({ success: false, message: 'Assignment not found' });
        
        // check if already submitted
        const existing = assignment.submissions.find(s => s.studentId.toString() === req.user._id.toString());
        if (existing) return res.status(400).json({ success: false, message: 'Already submitted' });

        assignment.submissions.push({
            studentId: req.user._id,
            fileUrl: req.body.fileUrl || 'dummy_file_url.pdf',
            submittedAt: new Date()
        });

        await assignment.save();
        res.json({ success: true, message: 'Assignment submitted successfully' });
    } catch (error) {
        console.error('Error submitting assignment:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
