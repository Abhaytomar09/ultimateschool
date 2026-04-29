const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date, required: true },
    // A simplified array of submissions
    submissions: [{
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        fileUrl: { type: String },
        submittedAt: { type: Date, default: Date.now },
        marksAwarded: { type: Number },
        feedback: { type: String }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Assignment', AssignmentSchema);
