const express = require("express");
const router = express.Router();

const { registerProfessor } = require("../controllers/professors_controller");

router.post("/register", registerProfessor);

module.exports = router;
