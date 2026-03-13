const Team = require('../models/team');
const Employee = require('../models/employee');

// Create a team and assign teamId to selected employees
exports.addTeam = async (req, res) => {
  const { name, members } = req.body;
  const companyId = req.user?.id;

  if (!name || !companyId) {
    return res.status(400).json({ message: 'Team name and company ID are required' });
  }

  try {
    const employees = await Employee.find({ _id: { $in: members }, companyId });
    if (employees.length !== members.length) {
      return res.status(400).json({ message: 'Some selected employees are invalid or not from your company' });
    }

    const team = new Team({ name, companyId, members });
    await team.save();

    // ✅ Update teamId for selected employees
    await Employee.updateMany(
      { _id: { $in: members } },
      { $set: { teamId: team._id } }
    );

    res.status(201).json({ message: 'Team created successfully', team });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all teams for a company
exports.getTeamsByCompany = async (req, res) => {
  try {
    const companyId = req.user?.id;
    const teams = await Team.find({ companyId }).populate('members', 'name email');
    res.json({ teams });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch teams', error: err.message });
  }
};

// Get team by ID
exports.getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate('members', 'name email role');
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.json({ team });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load team', error: err.message });
  }
};

// Remove member and unset their teamId
exports.removeTeamMember = async (req, res) => {
  const { teamId, employeeId } = req.params;

  try {
    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    team.members = team.members.filter(
      (memberId) => memberId.toString() !== employeeId
    );
    await team.save();

    // ✅ Unset the teamId on the employee
    await Employee.findByIdAndUpdate(employeeId, { $unset: { teamId: "" } });

    res.json({ message: 'Member removed from team' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove member', error: err.message });
  }
};

// Add members and update their teamId
exports.addMembersToTeam = async (req, res) => {
  const { teamId } = req.params;
  const { employeeIds } = req.body;

  try {
    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    const uniqueToAdd = employeeIds.filter(
      (id) => !team.members.map((m) => m.toString()).includes(id)
    );

    team.members.push(...uniqueToAdd);
    await team.save();

    // ✅ Set teamId for the newly added members
    await Employee.updateMany(
      { _id: { $in: uniqueToAdd } },
      { $set: { teamId: teamId } }
    );

    res.status(200).json({ message: 'Employees added to team' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add members', error: err.message });
  }
};

// Edit team name
exports.editTeamName = async (req, res) => {
  const { teamId } = req.params;
  const { name } = req.body;

  if (!name) return res.status(400).json({ message: 'Team name is required' });

  try {
    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    team.name = name;
    await team.save();

    res.status(200).json({ message: 'Team name updated', team });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update team name', error: err.message });
  }
};

// Get total number of teams for a company
exports.getTeamCount = async (req, res) => {
  try {
    const companyId = req.user?.id || req.user?._id;
    if (!companyId) {
      return res.status(400).json({ error: 'Company ID missing in token' });
    }

    const count = await Team.countDocuments({ companyId });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching team count' });
  }
};

exports.deleteTeamById = async (req, res) => {
  try {
    const teamId = req.params.id;

    // Optional: Remove this team reference from employees
    await Employee.updateMany({ teamId }, { $unset: { teamId: "" } });

    // Delete the team
    const deleted = await Team.findByIdAndDelete(teamId);

    if (!deleted) {
      return res.status(404).json({ message: "Team not found" });
    }

    return res.status(200).json({ message: "Team deleted successfully" });
  } catch (error) {
    console.error("Error deleting team:", error);
    return res.status(500).json({ message: "Server error while deleting team" });
  }
};
