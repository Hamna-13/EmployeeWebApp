const Employee = require('../models/employee');
const Team = require('../models/team');
const Attendance = require('../models/attendance');

exports.getDashboardStats = async (req, res) => {
  const companyId = req.user?.id;
  const today = new Date().toISOString().slice(0, 10);

  if (!companyId) {
    return res.status(400).json({ message: 'Company ID not found in token' });
  }

  try {
    const [employeeCount, teamCount, todayAttendances] = await Promise.all([
      Employee.countDocuments({ companyId }),
      Team.countDocuments({ companyId }),
      Attendance.find({ date: today }).populate({
        path: 'employeeId',
        match: { companyId }
      })
    ]);

    const todayCheckIns = todayAttendances.filter(a => a.employeeId).length;

    res.json({
      employeeCount,
      teamCount,
      todayCheckIns
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ message: 'Failed to load dashboard stats', error: err.message });
  }
};

exports.getCompanyEmployees = async (req, res) => {
  try {
    const companyId = req.user?.companyId || req.user?.id;

    if (!companyId) {
      return res.status(400).json({ message: 'Company ID not found in token' });
    }

    // Fetch all employees and teams for this company
    const [employees, teams] = await Promise.all([
      Employee.find({ companyId }),
      Team.find({ companyId })
    ]);

    // Match each employee with their team name
    const data = employees.map(emp => {
      const team = teams.find(t => t.members.some(m => m.toString() === emp._id.toString()));
      return {
        _id: emp._id,
        name: emp.name,
        email: emp.email,
        teamName: team?.name || 'Unassigned'
      };
    });

    res.status(200).json({ employees: data });
  } catch (err) {
    console.error('getCompanyEmployees error:', err);
    res.status(500).json({ message: 'Failed to fetch employees', error: err.message });
  }
};


exports.editEmployeeTeam = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { teamId } = req.body;

    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    employee.teamId = teamId;
    await employee.save();

    res.status(200).json({ message: 'Employee team updated' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update team', error: err.message });
  }
};