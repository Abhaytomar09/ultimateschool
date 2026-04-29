const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    academicYear: {
        type: String,
        required: true,
        trim: true,
    },
    classTeacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
}, { timestamps: true });

// Prevent duplicate classes per school and academic year
ClassSchema.index({ schoolId: 1, name: 1, academicYear: 1 }, { unique: true });

module.exports = mongoose.model('Class', ClassSchema);
