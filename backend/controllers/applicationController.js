const Application = require('../models/application');
const Interview = require('../models/interview');
const User = require('../models/user');

// Apply for Interview
module.exports.apply = async (req, res) => {
    try {
        const { interviewId } = req.params;
        const studentId = req.user._id;

        // Check if already applied
        const existingApp = await Application.findOne({ student: studentId, interview: interviewId });
        if (existingApp) {
            return res.status(400).json({ success: false, message: 'Already applied' });
        }

        // Check eligibility (Double check server side)
        const student = await User.findById(studentId);
        const interview = await Interview.findById(interviewId);

        if (student.scores.dsa < interview.eligibility.minDsa ||
            student.scores.webd < interview.eligibility.minWebd ||
            student.scores.react < interview.eligibility.minReact) {
            return res.status(403).json({ success: false, message: 'Not eligible' });
        }

        await Application.create({
            student: studentId,
            interview: interviewId,
            status: 'applied'
        });

        return res.status(201).json({ success: true, message: 'Applied successfully' });

    } catch (error) {
        console.error("Apply Error:", error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Get My Applications (Student)
module.exports.myApplications = async (req, res) => {
    try {
        const applications = await Application.find({ student: req.user._id })
            .populate('interview', 'companyName role date status')
            .sort({ appliedAt: -1 });

        return res.status(200).json({ success: true, applications });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Get All Applications (Admin)
module.exports.getAll = async (req, res) => {
    try {
        const applications = await Application.find({})
            .populate('student', 'name email')
            .populate('interview', 'companyName role')
            .sort({ appliedAt: -1 });
        return res.status(200).json({ success: true, applications });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Update Status (Admin)
module.exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const application = await Application.findByIdAndUpdate(id, { status, updatedAt: Date.now() }, { new: true });

        if (status === 'selected') {
            await User.findByIdAndUpdate(application.student, { isPlaced: true });
        }

        return res.status(200).json({ success: true, message: 'Status updated', application });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Get Applications for Interview (Admin)
module.exports.getApplicationsForInterview = async (req, res) => {
    try {
        const { interviewId } = req.params;
        const applications = await Application.find({ interview: interviewId })
            .populate('student', 'name email batch scores isPlaced');

        return res.status(200).json({ success: true, applications });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
