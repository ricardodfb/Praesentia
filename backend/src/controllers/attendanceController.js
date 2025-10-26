const Attendance = require('../models/attendanceModel');

const getAllAttendance = async (req, res) => {
  try {
    const data = await Attendance.getAll();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la asistencia' });
  }
};

const addAttendance = async (req, res) => {
  try {
    const { student_id, class_id, status, timestamp } = req.body;
    const result = await Attendance.add({ student_id, class_id, status, timestamp });
    res.status(201).json({ message: 'Asistencia registrada', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar la asistencia' });
  }
};

module.exports = { getAllAttendance, addAttendance };
