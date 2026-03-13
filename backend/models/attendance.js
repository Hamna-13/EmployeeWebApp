const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  checkInTime: {
    type: Date,
    required: true,
  },
  checkOutTime: {
    type: Date,
  },
  date: {
    type: String,
    required: true,
  },
  totalWorked: {
  type: String, 
  default: "00:00:00"
},
breaks: [
    {
      start: Date,
      end: Date,
    },
  ],
  totalBreakTime: {
    type: String,
    default: '00:00:00',
  },
});

module.exports = mongoose.model('Attendance', attendanceSchema);
