const express = require("express");
const router = express.Router();

router.use("/users", require("./authRoutes"));
router.use("/interviews", require("./interviews"));
router.use("/jobs", require("./jobs"));
router.use("/dashboard", require("./dashboardRoutes"));
router.use("/applications", require("./applicationRoutes"));


module.exports = router;
