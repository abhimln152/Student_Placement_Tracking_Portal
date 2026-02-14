const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const passport = require('passport');

// Admin Stats
router.get('/admin', passport.authenticate('jwt', { session: false }), dashboardController.getAdminStats);

// Student Stats
router.get('/student', passport.authenticate('jwt', { session: false }), dashboardController.getStudentStats);

module.exports = router;
