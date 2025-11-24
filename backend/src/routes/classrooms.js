const express = require("express");
const router = express.Router();

const { createClassroom } = require("../controllers/classrooms_controller");

router.post("/create", createClassroom);

module.exports = router;
