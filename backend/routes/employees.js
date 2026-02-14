const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employee_Controller");

router.post("/signup", employeeController.create);
router.post("/signin", employeeController.signIn);
router.post("/forget-password", employeeController.forgetPassword);

module.exports = router;
