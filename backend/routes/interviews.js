const express = require("express");
const router = express.Router();
const passport = require("passport");
const interviewController = require("../controllers/interview_Controller");

const verifyToken = passport.authenticate('jwt', { session: false });

router.get('/', verifyToken, interviewController.getAll);
router.post('/create', verifyToken, interviewController.create);
router.get('/:id', verifyToken, interviewController.getOne);
router.post('/:id/allocate', verifyToken, interviewController.allocateStudent);

module.exports = router;
