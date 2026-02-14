const mongoose = require('mongoose');
const User = require('./models/user');
const Interview = require('./models/interview');
const Application = require('./models/application');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL).then(() => console.log("DB Connected"));

        // Clear existing data
        await User.deleteMany({});
        await Interview.deleteMany({});
        await Application.deleteMany({});

        // Create Admin
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin'
        });
        console.log("Admin Created: admin@example.com / admin123");

        // Create Student
        const student = await User.create({
            name: 'John Doe',
            email: 'student@example.com',
            password: hashedPassword,
            role: 'student',
            batch: '2024',
            college: 'IIT Delhi',
            scores: { dsa: 80, webd: 75, react: 70 }
        });
        console.log("Student Created: student@example.com / admin123");

        // Create Interview
        const interview = await Interview.create({
            companyName: 'Google',
            role: 'SDE-1',
            package: '30 LPA',
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            eligibility: { minDsa: 70, minWebd: 60, minReact: 50 },
            createdBy: admin._id
        });
        console.log("Interview Created: Google SDE-1");

        // Enroll Student
        // await Application.create({
        //     student: student._id,
        //     interview: interview._id,
        //     status: 'applied'
        // });

        console.log("Seeding Complete");
        process.exit();
    } catch (error) {
        console.error("Seeding Error:", error);
        process.exit(1);
    }
};

seedDB();
