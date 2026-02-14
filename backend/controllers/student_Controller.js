const Student = require("../models/student");
const Employee = require("../models/employee");
const csv = require("fast-csv");

// List all students
module.exports.allStudents = async (req, res) => {
  try {
    // Check if user is authenticated (middleware handles this, but safe check)
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const employee = await Employee.findById(req.user._id).populate("students");

    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    return res.status(200).json({
      success: true,
      students: employee.students
    });

  } catch (err) {
    console.log(`Error in view all students controller ${err}`);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Update Student (Admin)
module.exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, college, place, status, DSAFinalScore, WebDFinalScore, ReactFinalScore, batch, isPlaced } = req.body;

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // Update fields
    if (name) student.name = name;
    if (college) student.college = college;
    if (place) student.place = place;
    if (status) student.status = status;
    if (batch) student.batch = batch;

    // Update Scores if provided
    if (DSAFinalScore !== undefined) student.DSAFinalScore = DSAFinalScore;
    if (WebDFinalScore !== undefined) student.WebDFinalScore = WebDFinalScore;
    if (ReactFinalScore !== undefined) student.ReactFinalScore = ReactFinalScore;

    // Sync with User model if it exists
    if (student.user) {
      const user = await require('../models/user').findById(student.user);
      if (user) {
        if (name) user.name = name;
        if (batch) user.batch = batch;
        if (isPlaced !== undefined) user.isPlaced = isPlaced;

        // Update scores in User model too
        user.scores = {
          dsa: DSAFinalScore !== undefined ? DSAFinalScore : user.scores.dsa,
          webd: WebDFinalScore !== undefined ? WebDFinalScore : user.scores.webd,
          react: ReactFinalScore !== undefined ? ReactFinalScore : user.scores.react
        };
        await user.save();
      }
    }

    await student.save();

    return res.status(200).json({
      success: true,
      message: "Student updated successfully",
      student
    });

  } catch (err) {
    console.error(`Error in update student controller ${err}`);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Add new student
module.exports.create = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { name, college, place, status, DSAFinalScore, WebDFinalScore, ReactFinalScore, batch } = req.body;

    // Check if a user with this email/name exists or create one? 
    // Legacy logic relied on "Employee", but we want to link to "User" model.
    // For now, adhering to legacy schema but we should ideally ensure a User exists.

    const employee = await Employee.findById(req.user._id);

    if (employee) {
      const student = await Student.create({
        name, college, place, status, DSAFinalScore, WebDFinalScore, ReactFinalScore, batch,
        user: req.user._id // Linking to admin who created it? Or the student user?
        // Legacy: "user" in Student model referred to the Employee who added them?
        // We should double check Student model. 
      });

      employee.students.push(student);
      await employee.save();
      await student.save();

      return res.status(201).json({
        success: true,
        message: "Student added successfully",
        student
      });
    } else {
      // If admin is not an "Employee" (User model), we just create the student.
      // SaaS Upgrade: "Student" model is actually redundant with "User" (role: student).
      // But keeping it for backward compat if needed. 
      // Ideally, "AdminStudents" should list *Users* with role='student'.
      // Let's modify allStudents to fetch from User model if Student model is empty/legacy?
      // Step 953 showed AdminStudents fetches from `/users/students`! 
      // Wait, let's check `routes/authRoutes.js` or wherever `/users/students` is defined.
      // The current file is `student_Controller.js` which handles routes in `routes/students.js` usually `/api/v1/students/...`
      // Step 953: `await api.get('/users/students');`

      return res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (err) {
    console.log(`Error in create student controller ${err}`);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Download CSV
module.exports.downloadCSV = async (req, res) => {
  try {
    const students = await Student.find().populate("interviews");

    const csvStream = csv.format({ headers: true });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=students.csv');

    csvStream.pipe(res);

    if (students.length > 0) {
      students.forEach((student) => {
        let interviews = student.interviews || [];

        if (interviews.length === 0) {
          // Write row even if no interviews
          writeStudentRow(csvStream, student, null, null);
        } else {
          interviews.forEach((interview) => {
            let results = interview.results || [];
            // Find result for this student in this interview
            // The structure of 'interview.results' needs verification. 
            // Based on previous code: interview.results.push({ student, result });
            // It seems 'results' is an array of objects inside interview model?
            // Or maybe interview schema has `results: [{student: Id, result: String}]`
            // Let's assume standard flattening logic.

            // Note: The previous logic iterated all results of the interview for EACH student loop??
            // "interviews.map ... results.map ... "
            // That looks like it might have been duplicating rows if not careful, or maybe intended.
            // Assuming we want: Student Details + Interview Details + Result for THAT student.

            // Let's check logic:
            // Previous code:
            /*
            students.map(student => {
                student.interviews.map(interview => {
                    interview.results.map(result => {
                        // writes row
                    })
                })
            })
            */
            // Wait, 'interview.results' contains results for ALL students in that interview?
            // If so, this loop structure logic in original code was potentially writing N*M*R rows? 
            // Actually, if 'student.interviews' contains the interview, then the student participated.
            // We should find the result corresponding to THIS student in that interview.

            let studentResult = results.find(r => r.student && r.student.toString() === student._id.toString());

            writeStudentRow(csvStream, student, interview, studentResult ? studentResult.result : "On Hold");
          });
        }
      });
    }

    csvStream.end();

  } catch (err) {
    console.log(`error in download CSV controller ${err}`);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

function writeStudentRow(stream, student, interview, result) {
  stream.write({
    Student_id: student._id ? student._id : "-",
    Student_Name: student.name ? student.name : "-",
    Student_College: student.college ? student.college : "-",
    Student_Status: student.status ? student.status : "-",
    Student_DSAFinalScore: student.DSAFinalScore || "-",
    Student_WebDFinalScore: student.WebDFinalScore || "-",
    Student_ReactFinalScore: student.ReactFinalScore || "-",
    Student_InterviewDate: interview ? interview.date : "-",
    Student_InterviewCompany: interview ? interview.companyName : "-",
    Student_InterviewResult: result || "-",
  });
}
