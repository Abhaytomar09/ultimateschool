const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
  studentId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User',       required: true },
  submittedAt:  { type: Date, required: true },
  score:        { type: Number, min: 0, max: 100 }
}, { timestamps: true });

module.exports = mongoose.model('Submission', SubmissionSchema);
