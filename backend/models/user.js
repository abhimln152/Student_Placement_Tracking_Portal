const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'student'], default: 'student', required: true },

    // Student Profiling
    batch: String,
    college: String,
    isPlaced: { type: Boolean, default: false },
    contactNumber: String,
    resumeLink: String,

    // Academic Scores
    scores: {
        dsa: { type: Number, default: 0 },
        webd: { type: Number, default: 0 },
        react: { type: Number, default: 0 }
    },
    resumePath: {
        type: String,
        default: ''
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
