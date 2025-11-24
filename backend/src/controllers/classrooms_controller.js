const pool = require("../db/connection");

exports.createClassroom = async (req, res) => {
  const { name, building, lat, lon, radius_meters, created_by } = req.body;

  if (!name || !lat || !lon) {
    return res.status(400).json({
      error: "name, lat y lon son obligatorios",
    });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO classrooms (name, building, lat, lon, radius_meters, created_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, building || null, lat, lon, radius_meters || 10, created_by || null]
    );

    res.status(201).json({
      message: "Aula registrada correctamente",
      classroom_id: result.insertId
    });
  } catch (error) {
    res.status(500).json({
      error: "Error registrando aula",
      details: error.message
    });
  }
};
