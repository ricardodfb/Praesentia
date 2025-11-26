const express = require("express");
const router = express.Router();

const {
  createClassroom,
  getClassrooms,
  updateClassroom,
  deleteClassroom
} = require("../controllers/classrooms_controller");

router.post("/create", createClassroom);
router.get("/", getClassrooms);
router.put("/:id", updateClassroom);
router.delete("/:id", deleteClassroom);

module.exports = router;
