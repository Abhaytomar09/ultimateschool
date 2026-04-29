const mongoose = require('mongoose');

const FeePaymentSchema = new mongoose.Schema({
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    academicYear: { type: String, required: true },
    feeType: { type: String, enum: ['monthly', 'quarterly', 'annual', 'admission'], required: true },
    amountDue: { type: Number, required: true }, // In ₹
    amountPaid: { type: Number, default: 0 },    // In ₹
    status: { type: String, enum: ['Paid', 'Pending', 'Partial'], default: 'Pending' },
    dueDate: { type: Date, required: true },
    paymentDate: { type: Date },
    paymentMode: { type: String, enum: ['Online', 'Offline'] },
    receiptUrl: { type: String }
}, { timestamps: true });

// Pre-save to calculate status
FeePaymentSchema.pre('save', function(next) {
    if (this.amountPaid >= this.amountDue) {
        this.status = 'Paid';
    } else if (this.amountPaid > 0) {
        this.status = 'Partial';
    } else {
        this.status = 'Pending';
    }
    next();
});

module.exports = mongoose.model('FeePayment', FeePaymentSchema);
