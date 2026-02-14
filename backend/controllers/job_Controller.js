const JobLink = require('../models/jobLink');

// Create a new Job Link
module.exports.create = async (req, res) => {
  try {
    const { companyName, role, jobUrl, description } = req.body;

    const newJob = await JobLink.create({
      companyName,
      role,
      jobUrl,
      description
    });

    return res.status(201).json({
      success: true,
      message: "Job link created successfully",
      job: newJob
    });

  } catch (error) {
    console.error("Create Job Link Error:", error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Get All Job Links (Public/Student/Admin)
module.exports.getAll = async (req, res) => {
  try {
    const jobs = await JobLink.find({ status: 'active' }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, jobs });
  } catch (error) {
    console.error("Get Jobs Error:", error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Delete Job Link (Admin)
module.exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    await JobLink.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "Job link deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// External Fetch (Optional/Legacy - Keeping if needed, otherwise removing)
// module.exports.fetch = ... (Removed to focus on Curated Links as requested)
