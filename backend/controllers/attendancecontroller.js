const Attendance = require('../models/attendance');
const Employee = require('../models/employee');
const Team = require('../models/team');

exports.checkIn = async (req, res) => {
  const { id: employeeId } = req.user;
  const today = new Date().toISOString().slice(0, 10);

  try {
    const existing = await Attendance.findOne({ employeeId, date: today });
    if (existing) {
      return res.status(400).json({ message: 'Already checked in today' });
    }

    const attendance = new Attendance({
      employeeId,
      checkInTime: new Date(),
      date: today,
    });

    await attendance.save();
    res.status(201).json(attendance);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.checkOut = async (req, res) => {
  const { id: employeeId } = req.user;
  const today = new Date().toISOString().slice(0, 10);

  try {
    const attendance = await Attendance.findOne({ employeeId, date: today });

    if (!attendance || attendance.checkOutTime) {
      return res.status(400).json({ message: 'Not checked in or already checked out' });
    }

    const checkOutTime = new Date();
    attendance.checkOutTime = checkOutTime;

    const durationMs = checkOutTime - new Date(attendance.checkInTime);
    const hours = Math.floor(durationMs / (1000 * 60 * 60)).toString().padStart(2, '0');
    const minutes = Math.floor((durationMs / (1000 * 60)) % 60).toString().padStart(2, '0');
    const seconds = Math.floor((durationMs / 1000) % 60).toString().padStart(2, '0');

    attendance.totalWorked = `${hours}:${minutes}:${seconds}`;

    await attendance.save();
    res.status(200).json(attendance);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
exports.startBreak = async (req, res) => {
  const { id: employeeId } = req.user;
  const today = new Date().toISOString().slice(0, 10);

  try {
    const attendance = await Attendance.findOne({ employeeId, date: today });
    if (!attendance || attendance.checkOutTime) {
      return res.status(400).json({ message: 'Cannot start break without check-in or after check-out' });
    }

    attendance.breaks.push({ start: new Date() });
    await attendance.save();

    res.status(200).json({ message: 'Break started' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.endBreak = async (req, res) => {
  const { id: employeeId } = req.user;
  const today = new Date().toISOString().slice(0, 10);

  try {
    const attendance = await Attendance.findOne({ employeeId, date: today });
    if (!attendance || attendance.checkOutTime) {
      return res.status(400).json({ message: 'Cannot end break without check-in or after check-out' });
    }

    const lastBreak = attendance.breaks[attendance.breaks.length - 1];
    if (!lastBreak || lastBreak.end) {
      return res.status(400).json({ message: 'No ongoing break to end' });
    }

    lastBreak.end = new Date();

    // Calculate total break time
    const totalMs = attendance.breaks.reduce((acc, b) => {
      if (b.start && b.end) {
        acc += new Date(b.end) - new Date(b.start);
      }
      return acc;
    }, 0);

    const h = String(Math.floor(totalMs / (1000 * 60 * 60))).padStart(2, '0');
    const m = String(Math.floor((totalMs / (1000 * 60)) % 60)).padStart(2, '0');
    const s = String(Math.floor((totalMs / 1000) % 60)).padStart(2, '0');

    attendance.totalBreakTime = `${h}:${m}:${s}`;

    await attendance.save();

    res.status(200).json({ message: 'Break ended', totalBreakTime: attendance.totalBreakTime });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getTodayAttendance = async (req, res) => {
  const { id: employeeId } = req.user;
  const today = new Date().toISOString().slice(0, 10);

  try {
    const attendance = await Attendance.findOne({ employeeId, date: today });
    if (!attendance) {
      return res.status(404).json({ message: 'No attendance found for today' });
    }

    res.status(200).json(attendance);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getEmployeeAttendanceHistory = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const attendance = await Attendance.find({ employeeId }).sort({ date: -1 });
    res.json({ attendance });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch attendance', error: err.message });
  }
};

const mongoose = require('mongoose');

exports.getAttendanceById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid attendance ID' });
  }

  try {
    const attendance = await Attendance.findById(id);

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance not found' });
    }

    // If the user is an employee, restrict access to their own record
    if (req.user.role === 'employee' && attendance.employeeId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: Not your attendance record' });
    }

    res.status(200).json(attendance);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



exports.getTodayAttendanceForCompany = async (req, res) => {
  const companyId = req.user?.id;
  const today = new Date().toISOString().slice(0, 10);

  try {
    const attendanceRecords = await Attendance.find({ date: today })
      .populate({
        path: 'employeeId',
        match: { companyId },
        populate: {
          path: 'companyId',
        },
      });

    const filtered = attendanceRecords.filter((record) => record.employeeId);

    const employees = await Employee.find({ companyId });
    const teams = await Team.find({ companyId });

    const data = filtered.map((record) => {
      const employee = record.employeeId;
      const team = teams.find((t) => t.members.some((m) => m.toString() === employee._id.toString()));
      return {
        id: record._id,
        employeeName: employee.name,
        teamName: team?.name || 'N/A',
        checkInTime: record.checkInTime,
        checkOutTime: record.checkOutTime,
        totalWorked: record.totalWorked
      };
    });

    res.json({ attendance: data });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch today attendance', error: err.message });
  }
};
exports.getAttendanceSummary = async (req, res) => {
  try {
    const companyId = req.user?.id;
    if (!companyId) {
      return res.status(400).json({ message: 'Company ID not found in token' });
    }

    const today = new Date();
    const summary = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const isoDate = date.toISOString().slice(0, 10);

      const dayRecords = await Attendance.find({ date: isoDate }).populate({
        path: 'employeeId',
        match: { companyId },
      });

      const checkedInCount = dayRecords.filter((rec) => rec.employeeId).length;

      summary.push({
        date: isoDate,
        checkedInCount,
      });
    }

    res.json({ summary: summary.reverse() }); // return oldest first
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch attendance summary', error: err.message });
  }
};

exports.getAttendanceDetailsByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const companyId = req.user?.id;
    if (!companyId) {
      return res.status(400).json({ message: 'Company ID not found in token' });
    }

    const records = await Attendance.find({ date }).populate({
      path: 'employeeId',
      match: { companyId },
    });

    const details = records
      .filter((r) => r.employeeId)
      .map((r) => ({
        _id: r._id,
        employeeName: r.employeeId.name,
        checkInTime: r.checkInTime,
        checkOutTime: r.checkOutTime,
        totalWorked: r.totalWorked,
      }));

    res.json({ date, details });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch attendance details', error: err.message });
  }
};

const jwt = require('jsonwebtoken');

exports.getWeeklyWorkingHours = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const employeeId = decoded.id;

    // Generate the last 7 dates as 'YYYY-MM-DD' strings
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i)); // older to latest
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    });

    const attendanceRecords = await Attendance.find({
      employeeId,
      date: { $in: last7Days }
    });

    const dataMap = {};
    last7Days.forEach(date => {
      dataMap[date] = 0;
    });

    attendanceRecords.forEach(record => {
      const [hh, mm] = (record.totalWorked || '00:00:00').split(':');
      const hours = parseFloat(hh) + parseFloat(mm) / 60;
      dataMap[record.date] = parseFloat(hours.toFixed(2));
    });

    const weeklyData = last7Days.map(date => ({
      date,
      totalWorkedHours: dataMap[date]
    }));

    res.json({ weeklyData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching weekly hours' });
  }
};


exports.getEmployeeAttendance = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'Unauthorized - no user ID' });
    }

    const { date, page = 1, limit = 15 } = req.query;
    const employeeId = req.user.id;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const query = { employeeId };
    if (date) query.date = date;

    // Count total matching documents
    const totalCount = await Attendance.countDocuments(query);

    // Fetch paginated results
    const attendance = await Attendance.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      attendance,
      totalCount,
      totalPages: Math.ceil(totalCount / limitNum),
      currentPage: pageNum,
      limit: limitNum
    });
  } catch (err) {
    console.error("getEmployeeAttendance error:", err);
    res.status(500).json({ message: 'Error fetching attendance', error: err.message });
  }
};


exports.getRecentAttendance = async (req, res) => {
  try {
    const employeeId = req.user.userId;

    // Get today and calculate the date two days ago
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - 2); // includes today, yesterday, and the day before

    // Convert startDate to string in 'YYYY-MM-DD' format
    const formattedStartDate = startDate.toISOString().slice(0, 10);

    // Fetch attendance records for the last 3 days
    const attendanceRecords = await Attendance.find({
      employeeId,
      date: { $gte: formattedStartDate } // Match records where date >= startDate
    })
    .sort({ date: -1 }) // Sort by date descending
    .select('date checkInTime checkOutTime totalWorked totalBreakTime');

    res.status(200).json({ attendance: attendanceRecords });
  } catch (error) {
    console.error('Error fetching recent attendance:', error);
    res.status(500).json({ message: 'Failed to fetch recent attendance' });
  }
};

// GET list of attendance records for one employee with pagination
// Query string supports page and limit
exports.getEmployeeAttendanceListForCompany = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const [total, records] = await Promise.all([
      Attendance.countDocuments({ employeeId }),
      Attendance.find({ employeeId })
        .select('date checkInTime checkOutTime totalWorked')
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    return res.status(200).json({
      success: true,
      records,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (error) {
    console.error('getEmployeeAttendanceListForCompany error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET full details of a single attendance record for that employee
exports.getEmployeeAttendanceDetailsForCompany = async (req, res) => {
  try {
    const { employeeId, attendanceId } = req.params;

    const record = await Attendance.findOne({ _id: attendanceId, employeeId })
      .select('_id employeeId date checkInTime checkOutTime totalWorked totalBreakTime breaks');

    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    // normalize breaks to an array
    const breaks = Array.isArray(record.breaks) ? record.breaks : [];

    return res.status(200).json({
      success: true,
      record: {
        _id: record._id,
        employeeId: record.employeeId,
        date: record.date,
        checkInTime: record.checkInTime,
        checkOutTime: record.checkOutTime,
        totalWorked: record.totalWorked,
        totalBreakTime: record.totalBreakTime,
        breaks,
      },
    });
  } catch (error) {
    console.error('getEmployeeAttendanceDetailsForCompany error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};






