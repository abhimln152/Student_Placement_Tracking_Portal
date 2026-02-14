const Interview = require('../models/interview');
const User = require('../models/user');

// Create Interview (Admin)
module.exports.create = async (req, res) => {
  try {
    const { company, role, package, date, minDsa, minWebd, minReact } = req.body;

    const newInterview = await Interview.create({
      companyName: company,
      role,
      package,
      date,
      createdBy: req.user._id,
      eligibility: {
        minDsa: minDsa || 0,
        minWebd: minWebd || 0,
        minReact: minReact || 0
      }
    });

    return res.status(201).json({ success: true, message: 'Interview created', interview: newInterview });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Get All Interviews (For Admin and Student - Filter logic can be here or in specialized routes)
// For Student, we might want to flag "Applied" status, but "myApplications" handles history.
// This endpoint lists ALL drives.
module.exports.getAll = async (req, res) => {
  try {
    const interviews = await Interview.find({}).sort({ date: 1 });
    return res.status(200).json({ success: true, interviews });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Get Single Interview
module.exports.getOne = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }
    return res.status(200).json({ success: true, interview });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Allocate Student (Legacy/Manual Override) - Optional
// SaaS model prefers Student "Applying"
// But Admin might want to manually create an Application
const Application = require('../models/application');
module.exports.allocateStudent = async (req, res) => {
  try {
    const { id } = req.params; // Interview ID
    const { email } = req.body; // Student Email to allocate

    const student = await User.findOne({ email, role: 'student' });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Check already applied
    const existing = await Application.findOne({ student: student._id, interview: id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Already allocated/applied' });
    }

    await Application.create({
      student: student._id,
      interview: id,
      status: 'shortlisted' // Admin manual allocation usually implies shortlisting
    });

    return res.status(201).json({ success: true, message: 'Student allocated successfully' });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
