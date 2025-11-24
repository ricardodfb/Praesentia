const express = require("express");
const cors = require("cors");

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas
const studentRoutes = require("./routes/students");
const userRoutes = require("./routes/users");
const professorRoutes = require("./routes/professors");
const classroomRoutes = require("./routes/classrooms");
const courseRoutes = require("./routes/courses");
const scheduleRoutes = require("./routes/schedules");
const sessionRoutes = require("./routes/sessions");
const attendanceRoutes = require("./routes/attendance");
const queryRoutes = require("./routes/query");

// Registro de rutas base
app.use("/api/students", studentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/professors", professorRoutes);
app.use("/api/classrooms", classroomRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/query", queryRoutes);

// Ruta raíz
app.get("/", (req, res) => {
  res.json({ message: "API de PRAESENTIA funcionando" });
});

module.exports = app;
