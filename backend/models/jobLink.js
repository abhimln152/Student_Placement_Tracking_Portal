const mongoose = require('mongoose');

const jobLinkSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    jobUrl: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('JobLink', jobLinkSchema);
