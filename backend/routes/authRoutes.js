const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require('passport');

const upload = require('../middleware/upload');

router.post('/login', authController.login);
router.post('/create', authController.create); // Open for dev, or protect separately
router.get('/students', passport.authenticate('jwt', { session: false }), authController.getStudents);
router.put('/students/:id', passport.authenticate('jwt', { session: false }), authController.updateStudent);
router.get('/profile', passport.authenticate('jwt', { session: false }), authController.getProfile);
router.post('/upload-resume', passport.authenticate('jwt', { session: false }), upload.single('resume'), authController.uploadResume);

module.exports = router;
