const express = require("express");
const router = express.Router();

const { createSchedule } = require("../controllers/schedules_controller");

router.post("/create", createSchedule);

module.exports = router;
