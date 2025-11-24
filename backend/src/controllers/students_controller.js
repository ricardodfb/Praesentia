const pool = require("../db/connection");

exports.registerStudent = async (req, res) => {
  const { email, password, name, student_number, carrera, grupo } = req.body;

  if (!email || !password || !name || !student_number) {
    return res.status(400).json({
      error: "email, password, name y student_number son obligatorios",
    });
  }

  try {
    const conn = await pool.getConnection();

    await conn.beginTransaction();

    // Insertar en users
    const [userResult] = await conn.query(
      `INSERT INTO users (email, password_hash, role, name)
       VALUES (?, ?, 'Student', ?)`,
      [email, password, name]
    );

    const userId = userResult.insertId;

    // Insertar en students
    await conn.query(
      `INSERT INTO students (user_id, student_number, carrera, grupo)
       VALUES (?, ?, ?, ?)`,
      [userId, student_number, carrera || null, grupo || null]
    );

    await conn.commit();
    conn.release();

    res.status(201).json({
      message: "Estudiante registrado correctamente",
      user_id: userId,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error registrando estudiante",
      details: error.message,
    });
  }
};
