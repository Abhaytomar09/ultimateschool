const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: true,
    },
    customId: {
        type: String,
        required: true,
        lowercase: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'teacher', 'student', 'parent'],
        required: true,
    },
    // Optional specific fields
    linkedStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    classAssigned: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class'
    },
    setPasswordToken: {
        type: String,
    },
    setPasswordExpires: {
        type: Date,
    }
}, { timestamps: true });

// Compound index to ensure customId is unique per school
UserSchema.index({ schoolId: 1, customId: 1 }, { unique: true });

module.exports = mongoose.model('User', UserSchema);
