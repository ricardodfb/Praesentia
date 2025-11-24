const pool = require("../db/connection");

exports.registerUser = async (req, res) => {
  const { email, password, name, role } = req.body;

  if (!email || !password || !name || !role) {
    return res.status(400).json({
      error: "email, password, name y role son obligatorios",
    });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO users (email, password_hash, role, name)
       VALUES (?, ?, ?, ?)`,
      [email, password, role, name]
    );

    res.status(201).json({
      message: "Usuario registrado correctamente",
      user_id: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ error: "Error registrando usuario", details: error.message });
  }
};
