const express = require('express');
const router = express.Router();
const { getDashboardStats,getCompanyEmployees, editEmployeeTeam  } = require('../controllers/companycontroller');
const authMiddleware = require('../middleware/authmiddleware');

router.get('/dashboard-stats', authMiddleware, getDashboardStats);
router.get('/employees/company', authMiddleware, getCompanyEmployees);
router.put('/employees/:employeeId/team', authMiddleware, editEmployeeTeam);

module.exports = router;
