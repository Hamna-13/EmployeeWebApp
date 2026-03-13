const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const adminRoutes = require("./routes/adminroutes");
const authRoutes = require('./routes/authroutes');
const employeeRoutes = require('./routes/employeeroutes');
const teamRoutes = require('./routes/teamroutes');
const attendanceRoutes = require('./routes/attendanceroutes');
const companyRoutes = require('./routes/companyroutes');

app.use("/api/admin", adminRoutes);
app.use('/api/auth', authRoutes); 
app.use('/api/employees', employeeRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/company', companyRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(5000, () => console.log('Server running on port 5000'));
  })
  .catch((err) => console.error('MongoDB connection error:', err));
