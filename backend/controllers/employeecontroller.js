const Employee = require('../models/employee');
const Attendance = require('../models/attendance');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function generateRandomPassword(length = 10) {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
}

exports.addEmployee = async (req, res) => {
  const { email, name } = req.body; 
  const companyId = req.user?.id;

  if (!email || !companyId || !name) {
    return res.status(400).json({ message: 'Name, Email, and Company ID are required' });
  }

  try {
    const existing = await Employee.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Employee already exists' });

    const plainPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const newEmployee = new Employee({
      name,          
      email,
      password: hashedPassword,
      companyId,
      role: 'employee',
    });

    await newEmployee.save();

    res.status(201).json({
      message: 'Employee added successfully',
      email: newEmployee.email,
      name: newEmployee.name,
      password: plainPassword,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.employeeLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
  {
    userId: employee._id,
    role: employee.role,
    companyId: employee.companyId
  },
  process.env.JWT_SECRET,
  { expiresIn: '1d' }
);


    res.status(200).json({ token, employee: { name: employee.name, email: employee.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.listEmployees = async (req, res) => {
  try {
    const companyId = req.user?.id;

    const employees = await Employee.find({ companyId });

    const today = new Date().toISOString().split('T')[0];

    const enrichedEmployees = await Promise.all(
      employees.map(async (emp) => {
        const attendance = await Attendance.findOne({
          employeeId: emp._id,
          date: today,
        });

        return {
          ...emp._doc,
          attendance: attendance
            ? {
                checkInTime: attendance.checkInTime,
                checkOutTime: attendance.checkOutTime,
                totalWorked: attendance.totalWorked,
              }
            : null,
        };
      })
    );

    res.json({ employees: enrichedEmployees });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch employees', error: err.message });
  }
};


exports.updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  try {
    const updated = await Employee.findByIdAndUpdate(
      id,
      { name, email },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Employee not found" });

    res.json({ message: "Employee updated", employee: updated });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Employee.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Employee not found" });

    res.json({ message: "Employee deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};

exports.getEmployeeCount = async (req, res) => {
  try {
    const companyId = req.user?.id;
    if (!companyId) {
      return res.status(400).json({ message: 'Company ID not found in token' });
    }

    const count = await Employee.countDocuments({ companyId });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get employee count', error: err.message });
  }
};

exports.getCurrentEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.user.id).select('name email');
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMyTeam = async (req, res) => {
  try {
    const employeeId = req.user.id;

    // Get employee with populated team name only
    const employee = await Employee.findById(employeeId).populate('teamId', 'name');
    if (!employee || !employee.teamId) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Get all members in the same team (excluding passwords)
    const teamMembers = await Employee.find({ teamId: employee.teamId._id })
      .select('name email role'); // Only return relevant fields

    res.status(200).json({
      team: {
        id: employee.teamId._id,
        name: employee.teamId.name,
      },
      members: teamMembers,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const employeeId = req.user.id;

    // Fetch employee info
    const employee = await Employee.findById(employeeId)
      .select('name email role createdAt teamId')
      .populate('teamId', 'name');

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Count total attendance records
    const totalAttendance = await Attendance.countDocuments({ employeeId });

    // Get the latest attendance record
    const lastAttendance = await Attendance.findOne({ employeeId })
      .sort({ date: -1 })
      .select('checkInTime checkOutTime');

    res.status(200).json({
      name: employee.name,
      email: employee.email,
      joinedOn: employee.createdAt,
      team: employee.teamId ? employee.teamId.name : null,
      totalAttendanceDays: totalAttendance,
      lastCheckIn: lastAttendance?.checkInTime || null,
      lastCheckOut: lastAttendance?.checkOutTime || null,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
};
