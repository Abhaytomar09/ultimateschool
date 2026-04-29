const mongoose = require('mongoose');

const ReportCardSchema = new mongoose.Schema({
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    term: { type: String, required: true }, // e.g., 'Term 1', 'Finals'
    academicYear: { type: String, required: true },
    subjectMarks: [{
        subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
        marksObtained: { type: Number, required: true },
        maxMarks: { type: Number, required: true },
        normalizedPercentage: { type: Number } // 0-100%
    }],
    overallPercentage: { type: Number },
    rank: { type: Number }, // Calculated ranking
    attendancePercentage: { type: Number }
}, { timestamps: true });

// Pre-save hook to calculate percentages
ReportCardSchema.pre('save', function(next) {
    let totalObtained = 0;
    let totalMax = 0;
    
    this.subjectMarks.forEach(subject => {
        subject.normalizedPercentage = (subject.marksObtained / subject.maxMarks) * 100;
        totalObtained += subject.marksObtained;
        totalMax += subject.maxMarks;
    });
    
    if (totalMax > 0) {
        this.overallPercentage = (totalObtained / totalMax) * 100;
    }
    next();
});

module.exports = mongoose.model('ReportCard', ReportCardSchema);
