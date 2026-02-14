const Employee = require("../models/employee");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Sign Up API
module.exports.create = async (req, res) => {
  try {
    const { email, password, confirmPassword, name } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    let employee = await Employee.findOne({ email: email });

    if (employee) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    employee = await Employee.create({
      email,
      password: hashedPassword,
      name,
    });

    return res.status(201).json({
      success: true,
      message: "Employee registered successfully",
    });
  } catch (err) {
    console.error("Error in signup:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Sign In API
module.exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password" });
    }

    const employee = await Employee.findOne({ email: email });

    if (!employee) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, employee.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { _id: employee._id, email: employee.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token: "Bearer " + token,
      user: {
        id: employee._id,
        name: employee.name,
        email: employee.email
      }
    });
  } catch (err) {
    console.error("Error in signin:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Forget Password (simplified for now, usually requires email service)
module.exports.forgetPassword = async (req, res) => {
  // Implementation placeholder - in a real app, send email with reset link
  try {
    const { email, password, confirmPassword } = req.body;

    let employee = await Employee.findOne({ email: email });
    if (!employee) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    const salt = await bcrypt.genSalt(10);
    employee.password = await bcrypt.hash(password, salt);
    await employee.save(); // Use save instead of updateOne to run hooks if any

    return res.status(200).json({ success: true, message: "Password updated successfully" });

  } catch (err) {
    console.error("Error in forget password:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
