const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authmiddleware');
const { checkIn, checkOut, getTodayAttendance, startBreak, endBreak, getEmployeeAttendanceHistory, getAttendanceById, getTodayAttendanceForCompany, getAttendanceSummary, getAttendanceDetailsByDate, getWeeklyWorkingHours, getEmployeeAttendance, getRecentAttendance, getEmployeeAttendanceListForCompany, getEmployeeAttendanceDetailsForCompany } = require('../controllers/attendancecontroller');


router.get('/employee/:employeeId/records', authMiddleware, getEmployeeAttendanceListForCompany);
router.get('/employee/:employeeId/records/:attendanceId', authMiddleware, getEmployeeAttendanceDetailsForCompany);
router.post('/checkin', authMiddleware, checkIn);
router.post('/checkout', authMiddleware, checkOut);
router.post('/break/start', authMiddleware, startBreak);
router.post('/break/end', authMiddleware, endBreak);
router.get('/employee/attendance/:id', authMiddleware, getAttendanceById);
router.get('/today', authMiddleware, getTodayAttendance);
router.get('/employee/history', authMiddleware, getEmployeeAttendance);
router.get('/employee/:employeeId', authMiddleware, getEmployeeAttendanceHistory);
router.get('/record/:id', authMiddleware, getAttendanceById);
router.get('/today/company', authMiddleware, getTodayAttendanceForCompany);
router.get('/summary', authMiddleware, getAttendanceSummary);
router.get('/:date', authMiddleware, getAttendanceDetailsByDate);
router.get('/weekly-hours', authMiddleware, getWeeklyWorkingHours);
router.get('/recent', authMiddleware, getRecentAttendance);


module.exports = router;
