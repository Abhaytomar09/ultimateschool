const mongoose = require('mongoose');

const SchoolSchema = new mongoose.Schema({
    // Human-readable school code users enter at login (e.g. SCH001)
    schoolCode: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        type: String,
        required: true,
    },
    contactEmail: {
        type: String,
    },
    contactPhone: {
        type: String,
    },
    // Used for keeping track of the latest IDs to auto-generate
    idCounters: {
        student: { type: Number, default: 0 },
        teacher: { type: Number, default: 0 },
        parent: { type: Number, default: 0 },
        admin: { type: Number, default: 0 }
    }
}, { timestamps: true });

module.exports = mongoose.model('School', SchoolSchema);
