const express = require("express");
const router = express.Router();

const { generateSessions, getSessionsByCourse } = require("../controllers/sessions_controller");

router.post("/generate", generateSessions);
router.get("/course/:course_id", getSessionsByCourse);

module.exports = router;
