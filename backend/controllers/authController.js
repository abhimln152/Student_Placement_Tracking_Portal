const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT
const generateToken = (user) => {
    return jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
};

// Unified Login
module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check password (if plain text during migration vs hashed)
        // Ideally all passwords should be hashed. Assuming they are.
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = generateToken(user);

        return res.status(200).json({
            success: true,
            message: 'Login valid',
            token: `Bearer ${token}`,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Create User (Admin/Student) - Protected Route (Admin Only usually, or distinct signup)
// For now, let's keep a signup for Admin for dev, and Admin creates Students.
module.exports.create = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, role } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Passwords do not match" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'student' // Default to student if not specified
        });

        const token = generateToken(newUser);

        return res.status(201).json({
            success: true,
            message: 'User created successfully',
            token: `Bearer ${token}`,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error("Create User Error:", error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

// Get All Students (Admin)
module.exports.getStudents = async (req, res) => {
    try {
        const students = await User.find({ role: 'student' }).select('-password').sort({ createdAt: -1 });
        return res.status(200).json({ success: true, students });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Get Profile
module.exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        return res.status(200).json({ success: true, user });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

// Update Student (Admin)
module.exports.updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, batch, dsa, webd, react, isPlaced } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Update basic info
        if (name) user.name = name;
        if (batch) user.batch = batch;
        if (isPlaced !== undefined) user.isPlaced = isPlaced;

        // Update scores object - create if not exists
        if (!user.scores) user.scores = {};

        if (dsa !== undefined) user.scores.dsa = Number(dsa);
        if (webd !== undefined) user.scores.webd = Number(webd);
        if (react !== undefined) user.scores.react = Number(react);

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Student updated successfully",
            student: user
        });

    } catch (error) {
        console.error("Update Student Error:", error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Upload Resume
module.exports.uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload a file' });
        }

        const user = await User.findById(req.user._id);
        user.resumePath = `/uploads/${req.file.filename}`;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Resume uploaded successfully',
            filePath: user.resumePath
        });
    } catch (error) {
        console.error("Resume Upload Error:", error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
