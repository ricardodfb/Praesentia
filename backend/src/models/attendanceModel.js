const db = require('./db');

const Attendance = {
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM attendance');
    return rows;
  },

  add: async ({ student_id, class_id, status, timestamp }) => {
    const [result] = await db.query(
      'INSERT INTO attendance (student_id, class_id, status, timestamp) VALUES (?, ?, ?, ?)',
      [student_id, class_id, status, timestamp]
    );
    return result;
  }
};

module.exports = Attendance;
