const pool = require("../db/connection");

exports.registerProfessor = async (req, res) => {
  const { email, password, name, employee_id, depto } = req.body;

  if (!email || !password || !name || !employee_id) {
    return res.status(400).json({
      error: "email, password, name y employee_id son obligatorios",
    });
  }

  try {
    const conn = await pool.getConnection();
    await conn.beginTransaction();

    // Insertar usuario
    const [userRes] = await conn.query(
      `INSERT INTO users (email, password_hash, role, name)
       VALUES (?, ?, 'Teacher', ?)`,
      [email, password, name]
    );

    const userId = userRes.insertId;

    // Insertar profesor
    await conn.query(
      `INSERT INTO professors (user_id, employee_id, depto)
       VALUES (?, ?, ?)`,
      [userId, employee_id, depto || null]
    );

    await conn.commit();
    conn.release();

    res.status(201).json({
      message: "Profesor registrado correctamente",
      user_id: userId
    });

  } catch (error) {
    res.status(500).json({
      error: "Error registrando profesor",
      details: error.message
    });
  }
};
