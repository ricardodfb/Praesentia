const pool = require("../db/connection");

exports.getStudents = async (_, res) => {
  const [rows] = await pool.query("SELECT * FROM students");
  res.json(rows);
};

exports.getProfessors = async (_, res) => {
  const [rows] = await pool.query("SELECT * FROM professors");
  res.json(rows);
};

exports.getCourses = async (_, res) => {
  const [rows] = await pool.query("SELECT * FROM courses");
  res.json(rows);
};

exports.getClassrooms = async (_, res) => {
  const [rows] = await pool.query("SELECT * FROM classrooms");
  res.json(rows);
};

exports.getSchedules = async (_, res) => {
  const [rows] = await pool.query("SELECT * FROM course_schedule");
  res.json(rows);
};
