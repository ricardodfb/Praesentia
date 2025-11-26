const pool = require("../db/connection");

// create
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


// read
exports.getClassrooms = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM classrooms`);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({
      error: "Error obteniendo aulas",
      details: error.message
    });
  }
};


// update
exports.updateClassroom = async (req, res) => {
  const { id } = req.params;
  const { name, building, lat, lon, radius_meters } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE classrooms
       SET name = ?, building = ?, lat = ?, lon = ?, radius_meters = ?
       WHERE id = ?`,
      [name, building, lat, lon, radius_meters, id]
    );

    res.status(200).json({
      message: "Aula actualizada correctamente",
      affected: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({
      error: "Error actualizando aula",
      details: error.message
    });
  }
};


// delete
exports.deleteClassroom = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      `DELETE FROM classrooms WHERE id = ?`,
      [id]
    );

    res.status(200).json({
      message: "Aula eliminada correctamente",
      affected: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({
      error: "Error eliminando aula",
      details: error.message
    });
  }
};
