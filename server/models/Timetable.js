const mongoose = require('mongoose');

const TimetableSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: true,
    },
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true,
    },
    dayOfWeek: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true,
    },
    periods: [{
        startTime: { type: String, required: true }, // e.g., "08:00"
        endTime: { type: String, required: true },   // e.g., "08:45"
        subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
        teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }]
}, { timestamps: true });

// One timetable per class per day
TimetableSchema.index({ schoolId: 1, classId: 1, dayOfWeek: 1 }, { unique: true });

module.exports = mongoose.model('Timetable', TimetableSchema);
