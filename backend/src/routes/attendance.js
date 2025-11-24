const express = require("express");
const router = express.Router();

const { registerAttendance } = require("../controllers/attendance_controller");

router.post("/register", registerAttendance);

module.exports = router;
