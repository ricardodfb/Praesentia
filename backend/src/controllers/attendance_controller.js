const pool = require("../db/connection");
const { getDistanceMeters } = require("../utils/distance");

exports.registerAttendance = async (req, res) => {
  const { student_id, session_id, lat, lon } = req.body;

  if (!student_id || !session_id || !lat || !lon) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    const conn = await pool.getConnection();

    // Obtener sesión
    const [sessionRows] = await conn.query(
      `SELECT classroom_id FROM sessions WHERE id = ?`,
      [session_id]
    );

    if (sessionRows.length === 0) {
      conn.release();
      return res.status(404).json({ error: "Sesión no encontrada" });
    }

    const classroomId = sessionRows[0].classroom_id;

    // Obtener salón
    const [classRows] = await conn.query(
      `SELECT lat, lon, radius_meters FROM classrooms WHERE id = ?`,
      [classroomId]
    );

    const classLocation = classRows[0];

    // Calcular distancia
    const distance = getDistanceMeters(
      lat,
      lon,
      classLocation.lat,
      classLocation.lon
    );

    const status = distance <= classLocation.radius_meters ? "present" : "absent";

    // Registrar asistencia
    await conn.query(
      `INSERT INTO attendance_records (session_id, student_id, lat, lon, distance_meters, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [session_id, student_id, lat, lon, distance, status]
    );

    conn.release();

    res.json({
      message: "Asistencia registrada",
      status,
      distance_meters: distance,
      allowed_radius: classLocation.radius_meters
    });

  } catch (error) {
    res.status(500).json({ error: "Error registrando asistencia", details: error.message });
  }
};
