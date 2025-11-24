const express = require("express");
const router = express.Router();

const { registerStudent } = require("../controllers/students_controller");

router.post("/register", registerStudent);

module.exports = router;
