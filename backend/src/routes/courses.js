const express = require("express");
const router = express.Router();

const { createCourse } = require("../controllers/courses_controller");

router.post("/create", createCourse);

module.exports = router;
