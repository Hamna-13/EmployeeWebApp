const express = require('express');
const router = express.Router();
const { addTeam, getTeamsByCompany, getTeamById, removeTeamMember, addMembersToTeam, editTeamName, getTeamCount,deleteTeamById } = require('../controllers/teamcontroller');
const authMiddleware = require('../middleware/authmiddleware');

router.get('/list', authMiddleware, getTeamsByCompany);
router.post('/add', authMiddleware, addTeam);
router.get('/:id', authMiddleware, getTeamById);
router.delete('/:teamId/members/:employeeId', authMiddleware, removeTeamMember);
router.post('/:teamId/members', authMiddleware, addMembersToTeam);
router.put('/:teamId', authMiddleware, editTeamName);
router.get('/count', authMiddleware, getTeamCount); 
router.delete('/:id', authMiddleware, deleteTeamById);

module.exports = router;
