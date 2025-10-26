const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

dotenv.config();

// const attendanceRoutes = require('./routes/attendanceRoutes');
const testRoutes = require('./routes/testRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json()); // o express.json()
// app.use('/api/attendance', attendanceRoutes);
app.use('/testing', testRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
