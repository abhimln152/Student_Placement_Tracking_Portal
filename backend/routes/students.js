const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const studentController = require("../controllers/student_Controller");

router.get('/', verifyToken, studentController.allStudents);
router.post('/create', verifyToken, studentController.create);
router.get('/download-csv', verifyToken, studentController.downloadCSV);

module.exports = router;
