const pool = require("../db/connection");

exports.createSchedule = async (req, res) => {
  const { course_id, day_of_week, start_time, end_time, semester_start, semester_end } = req.body;

  if (!course_id || !day_of_week || !start_time || !end_time || !semester_start || !semester_end) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO course_schedule 
       (course_id, day_of_week, start_time, end_time, semester_start, semester_end)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [course_id, day_of_week, start_time, end_time, semester_start, semester_end]
    );

    res.status(201).json({
      message: "Horario registrado",
      schedule_id: result.insertId
    });

  } catch (error) {
    res.status(500).json({ error: "Error creando horario", details: error.message });
  }
};
