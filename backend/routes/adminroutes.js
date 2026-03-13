const express = require('express');
const router = express.Router();
const {adminLogin, getAllCompanies, getCompanyEmployees, getCompanyTeams, getTeamEmployees, getCompanyCount, getCompanyStats, deleteEmployee, getTeamById} = require('../controllers/admincontroller');
const authMiddleware = require('../middleware/authmiddleware');
const authorizeAdmin = require('../middleware/authorizeAdmin');

router.post("/login", adminLogin);

router.get("/companies", authMiddleware, authorizeAdmin, getAllCompanies);
router.get("/companies/:companyId/teams", authMiddleware, authorizeAdmin, getCompanyTeams);
router.get("/companies/:companyId/employees", authMiddleware, authorizeAdmin, getCompanyEmployees);
router.get("/companies/:companyId/teams/:teamId/employees", authMiddleware, authorizeAdmin, getTeamEmployees);
router.get("/companies/count", authMiddleware, authorizeAdmin, getCompanyCount);
router.get('/company/:id/stats', authMiddleware, authorizeAdmin, getCompanyStats);
router.get('/company/:companyId/employees', authMiddleware, authorizeAdmin, getCompanyEmployees);
router.get('/company/:companyId/teams', authMiddleware, authorizeAdmin, getCompanyTeams);
router.delete('/employee/:id', authMiddleware, authorizeAdmin, deleteEmployee);
router.get('/teams/:teamId', authMiddleware, authorizeAdmin, getTeamById);


module.exports = router;