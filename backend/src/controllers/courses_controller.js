const pool = require("../db/connection");

exports.createCourse = async (req, res) => {
  const { code, name, profesor_id } = req.body;

  if (!code || !name) {
    return res.status(400).json({
      error: "code y name son obligatorios",
    });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO courses (code, name, profesor_id)
       VALUES (?, ?, ?)`,
      [code, name, profesor_id || null]
    );

    res.status(201).json({
      message: "Curso registrado correctamente",
      course_id: result.insertId
    });
  } catch (error) {
    res.status(500).json({ error: "Error creando curso", details: error.message });
  }
};
