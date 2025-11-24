const pool = require("../db/connection");

// Utilidad para mapear día de semana texto → número
const dayMap = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6
};

// -------------------------------------------------------------
// GENERAR SESIONES AUTOMÁTICAMENTE
// -------------------------------------------------------------
exports.generateSessions = async (req, res) => {
  const { course_id, classroom_id } = req.body;

  if (!course_id || !classroom_id) {
    return res.status(400).json({
      error: "course_id y classroom_id son obligatorios"
    });
  }

  try {
    const conn = await pool.getConnection();

    // Obtener horario del curso
    const [schedules] = await conn.query(
      `SELECT * FROM course_schedule WHERE course_id = ?`,
      [course_id]
    );

    if (schedules.length === 0) {
      conn.release();
      return res.status(404).json({ error: "No se encontró horario para este curso" });
    }

    let totalSessions = 0;

    for (const schedule of schedules) {
      const dow = dayMap[schedule.day_of_week];
      const start = new Date(schedule.semester_start);
      const end = new Date(schedule.semester_end);

      // Avanza día por día entre semestre_start y semester_end
      let current = new Date(start);

      while (current <= end) {
        if (current.getDay() === dow) {
          const startDateTime = `${current.toISOString().split("T")[0]} ${schedule.start_time}`;
          const endDateTime = `${current.toISOString().split("T")[0]} ${schedule.end_time}`;

          // Guardar sesión
          await conn.query(
            `INSERT INTO sessions (course_id, classroom_id, start_datetime, end_datetime)
             VALUES (?, ?, ?, ?)`,
            [course_id, classroom_id, startDateTime, endDateTime]
          );

          totalSessions++;
        }

        current.setDate(current.getDate() + 1);
      }
    }

    conn.release();

    res.json({
      message: "Sesiones generadas correctamente",
      totalSessions
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error generando sesiones", details: error.message });
  }
};


// -------------------------------------------------------------
// LISTAR SESIONES POR CURSO
// -------------------------------------------------------------
exports.getSessionsByCourse = async (req, res) => {
  const { course_id } = req.params;

  try {
    const [sessions] = await pool.query(
      `SELECT * FROM sessions WHERE course_id = ? ORDER BY start_datetime`,
      [course_id]
    );

    res.json(sessions);

  } catch (error) {
    res.status(500).json({ error: "Error obteniendo sesiones", details: error.message });
  }
};
