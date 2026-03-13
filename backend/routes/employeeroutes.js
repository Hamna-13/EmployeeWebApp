const express = require('express');
const router = express.Router();

const {
  addEmployee,
  employeeLogin,
  listEmployees,
  updateEmployee,
  deleteEmployee,
  getEmployeeCount,
  getCurrentEmployee, 
  getMyTeam,
  getMyProfile
} = require('../controllers/employeecontroller');
const authMiddleware = require('../middleware/authmiddleware');

router.post('/add', authMiddleware, addEmployee);
router.post('/employeelogin', employeeLogin);
router.get('/list', authMiddleware, listEmployees);
router.put('/:id', authMiddleware, updateEmployee);
router.delete('/:id', authMiddleware, deleteEmployee);
router.get('/count', authMiddleware, getEmployeeCount);
router.get('/me', authMiddleware, getCurrentEmployee);
router.get('/myteam', authMiddleware, getMyTeam);
router.get('/myprofile', authMiddleware, getMyProfile);

module.exports = router;
