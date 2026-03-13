import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css';
import Signup from "./pages/signup";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Home from "./pages/home";
import EmployeeLogin from "./pages/employeelogin";
import EmployeeDashboard from "./pages/employeedashboard";
import Layout from './components/shared/layout';
import TeamDetails from "./pages/teamdetails";
import EmployeeHistory from './pages/employeehistory';
import AttendanceDetails from "./pages/attendancedetails";
import TeamsPage from './pages/teams';
import EmployeesTable from './pages/employees';
import AttendancePage from "./pages/attendance";
import AttendanceDetailsPage from "./pages/attendancedate";
import { DASHBOARD_SIDEBAR_LINKS, EMP_DASHBOARD_SIDEBAR_LINKS, DASHBOARD_SIDEBAR_BOTTOM_LINKS } from "./lib/constants/navigation";
import EmployeeAttendance from './pages/employeeattendance';
import EmpAttendanceDetails from './pages/empattendancedetails';
import MyTeamPage from './pages/employeeteam';
import MyProfilePage from './pages/employeeprofile';
import AdminLogin from './pages/admin/adminlogin';
import AdminLayout from './components/admin/adminlayout';
import AdminDashboard from './pages/admin/dashboard';
import CompanyDetails from './pages/admin/companydetails';
import EmployeeAttendanceList from "./pages/companyempattendance";
import EmployeeAttendanceDetails from "./pages/companyempdetails";

//import CompanyEmployees from './components/shared/adminlayout';
//import CompanyTeams from './components/shared/adminlayout';
//import CompanyAttendance from './components/shared/adminlayout';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/employeelogin" element={<EmployeeLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      

<Route path="/admin" element={<AdminLayout />}>
  <Route path="dashboard" element={<AdminDashboard />} />
  <Route path="company/:id" element={<CompanyDetails />} />
  {/* Comment these lines to fix the error until the components exist */}
  {/*
  
  <Route path="company/:id/employees" element={<CompanyEmployees />} />
  <Route path="company/:id/teams" element={<CompanyTeams />} />
  <Route path="company/:id/attendance" element={<CompanyAttendance />} />
  */}
</Route>


        {/* Company Dashboard Layout */}
        <Route
          path="/"
          element={<Layout sidebarItems={DASHBOARD_SIDEBAR_LINKS} bottomLinks={DASHBOARD_SIDEBAR_BOTTOM_LINKS} />}
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="teams" element={<TeamsPage />} />
          <Route path="teams/:id" element={<TeamDetails />} />
          <Route path="employees/:employeeId/attendance" element={<EmployeeAttendanceList />} />
<Route path="employees/:employeeId/attendance/:attendanceId" element={<EmployeeAttendanceDetails />} />

          <Route path="employees" element={<EmployeesTable />} />
          
          <Route path="employee/:id/employeehistory" element={<EmployeeHistory />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="attendance/by-date/:date" element={<AttendanceDetailsPage />} />
          <Route path="attendance/record/:id" element={<AttendanceDetails />}/>
          

          
        </Route>

        {/* Employee Dashboard Layout */}
        <Route
          path="/"
          element={<Layout sidebarItems={EMP_DASHBOARD_SIDEBAR_LINKS} bottomLinks={DASHBOARD_SIDEBAR_BOTTOM_LINKS} />}
        >
          <Route path="employeedashboard" element={<EmployeeDashboard />} />
          <Route path="myteam" element={<MyTeamPage />} />
          <Route path="myprofile" element={<MyProfilePage />} />
          <Route path="myattendance" element={<EmployeeAttendance />} />
          <Route path="myattendance/details/:id" element={<EmpAttendanceDetails />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
