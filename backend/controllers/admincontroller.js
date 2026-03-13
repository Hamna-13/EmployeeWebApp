const User = require("../models/user");
const Team = require("../models/team");
const Employee = require("../models/employee");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token,
      admin: {
        id: admin._id,
        name: `${admin.firstName} ${admin.lastName}`,
        email: admin.email
      }
    });
  } catch (err) {
    console.error("Admin login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await User.find({ role: "company" })
      .select("companyName email createdAt"); 
    res.status(200).json({ companies });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch companies" });
  }
};


exports.getCompanyTeams = async (req, res) => {
  const { companyId } = req.params;

  try {
    const teams = await Team.find({ companyId });
    res.status(200).json({ teams });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch teams" });
  }
};

exports.getCompanyEmployees = async (req, res) => {
  const { companyId } = req.params;

  try {
    const employees = await Employee.find({ companyId });
    res.status(200).json({ employees });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch employees" });
  }
};

exports.getTeamEmployees = async (req, res) => {
  const { companyId, teamId } = req.params;

  try {
    const employees = await Employee.find({ companyId, teamId });
    res.status(200).json({ employees });
  } catch (err) {
    console.error("Error fetching team employees:", err.message);
    res.status(500).json({ message: "Failed to fetch team employees" });
  }
};

exports.getCompanyCount = async (req, res) => {
  try {
    const count = await User.countDocuments({ role: 'company' });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCompanyStats = async (req, res) => {
  try {
    const companyId = req.params.id;

    const teamCount = await Team.countDocuments({ companyId: companyId });
    const employeeCount = await Employee.countDocuments({ companyId: companyId });

    res.status(200).json({ teamCount, employeeCount });
  } catch (error) {
    console.error("Error fetching company stats:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getCompanyEmployees = async (req, res) => {
  const companyId = req.params.companyId;

  try {
    const employees = await Employee.find({ companyId }).populate('teamId');
    res.status(200).json({ employees });
  } catch (err) {
    console.error('Error fetching company employees:', err);
    res.status(500).json({ message: 'Failed to fetch employees' });
  }
};

exports.getCompanyTeams = async (req, res) => {
  const companyId = req.params.companyId;

  try {
    const teams = await Team.find({ companyId });
    res.status(200).json({ teams });
  } catch (err) {
    console.error('Error fetching company teams:', err);
    res.status(500).json({ message: 'Failed to fetch teams' });
  }
};

exports.deleteEmployee = async (req, res) => {
  const employeeId = req.params.id;

  try {
    const deleted = await Employee.findByIdAndDelete(employeeId);
    if (!deleted) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Failed to delete employee' });
  }
};
exports.getTeamById = async (req, res) => {
  const { teamId } = req.params;

  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Get members of the team with only name and email
    const members = await Employee.find({ teamId }).select('name email');

    res.status(200).json({
      team: {
        _id: team._id,
        name: team.name,
        companyId: team.companyId,
        members
      }
    });
  } catch (error) {
    console.error('Error fetching team by ID:', error.message);
    res.status(500).json({ message: 'Failed to fetch team' });
  }
};

