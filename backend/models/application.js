const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    interview: { type: mongoose.Schema.Types.ObjectId, ref: 'Interview', required: true },
    status: {
        type: String,
        enum: ['applied', 'shortlisted', 'selected', 'rejected'],
        default: 'applied'
    },
    appliedAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Prevent duplicate applications for same interview by same student
applicationSchema.index({ student: 1, interview: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;
