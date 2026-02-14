const Application = require('../models/application');
const User = require('../models/user');
const Interview = require('../models/interview');

// Admin Stats
module.exports.getAdminStats = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: 'student' });
        const placedStudents = await User.countDocuments({ role: 'student', isPlaced: true });
        const activeDrives = await Interview.countDocuments({ date: { $gte: new Date() } });

        // Monthly Applications
        const monthlyApplications = await Application.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$appliedAt" },
                        month: { $month: "$appliedAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Placed vs Unplaced
        const placementStats = [
            { name: 'Placed', value: placedStudents },
            { name: 'Unplaced', value: totalStudents - placedStudents }
        ];

        return res.status(200).json({
            success: true,
            data: {
                totalStudents,
                placedStudents,
                placementPercentage: totalStudents > 0 ? ((placedStudents / totalStudents) * 100).toFixed(2) : 0,
                activeDrives,
                monthlyApplications,
                placementStats
            }
        });

    } catch (error) {
        console.error("Admin Stats Error:", error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Student Stats
module.exports.getStudentStats = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        const totalApplied = await Application.countDocuments({ student: userId });
        const totalShortlisted = await Application.countDocuments({ student: userId, status: 'shortlisted' });
        const totalSelected = await Application.countDocuments({ student: userId, status: 'selected' });

        // Eligible Drives Count
        // Logic: Drives where student scores >= eligibility
        // Note: This is a simplified check. Mongoose query might be complex if fields are dynamic.
        const eligibleDrivesCount = await Interview.countDocuments({
            'eligibility.minDsa': { $lte: user.scores.dsa },
            'eligibility.minWebd': { $lte: user.scores.webd },
            'eligibility.minReact': { $lte: user.scores.react },
            date: { $gte: new Date() } // Only future drives
        });

        return res.status(200).json({
            success: true,
            data: {
                isPlaced: user.isPlaced,
                totalApplied,
                totalShortlisted,
                totalSelected,
                eligibleDrivesCount
            }
        });

    } catch (error) {
        console.error("Student Stats Error:", error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
