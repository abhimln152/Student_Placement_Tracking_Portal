const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const passport = require('passport');

// Student: Apply
router.post('/apply/:interviewId', passport.authenticate('jwt', { session: false }), applicationController.apply);

// Student: My Applications
router.get('/my-applications', passport.authenticate('jwt', { session: false }), applicationController.myApplications);

// Admin: Get All Applications
router.get('/all', passport.authenticate('jwt', { session: false }), applicationController.getAll);

// Admin: Update Status
router.put('/:id/status', passport.authenticate('jwt', { session: false }), applicationController.updateStatus);

// Admin: Get Applications for Interview
router.get('/interview/:interviewId', passport.authenticate('jwt', { session: false }), applicationController.getApplicationsForInterview);

module.exports = router;
