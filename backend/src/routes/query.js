const express = require("express");
const router = express.Router();

const {
  getStudents,
  getProfessors,
  getCourses,
  getClassrooms,
  getSchedules
} = require("../controllers/query_controller");

router.get("/students", getStudents);
router.get("/professors", getProfessors);
router.get("/courses", getCourses);
router.get("/classrooms", getClassrooms);
router.get("/schedules", getSchedules);

module.exports = router;
