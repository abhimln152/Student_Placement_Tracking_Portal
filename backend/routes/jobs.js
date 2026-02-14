const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const jobController = require("../controllers/job_Controller");

router.post('/create', verifyToken, jobController.create);
router.get('/all', verifyToken, jobController.getAll);
router.delete('/:id', verifyToken, jobController.deleteJob);

module.exports = router;
