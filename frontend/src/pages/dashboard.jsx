import React, { useEffect, useState } from "react";
import AddEmployeeForm from "../components/addemployee";
import AddTeamForm from "../components/addteam";
import DashboardStatsGrid from "../components/statsgrid";
import TodayAttendanceTable from "../components/todayattendance";
import { HiOutlineUserAdd, HiPlus } from "react-icons/hi";
import AddEmployeeButton from "../components/addemployeebtn";
import AddTeamButton from "../components/addteambtn";

export default function Dashboard() {
  const [showAddEmployeeForm, setShowAddEmployeeForm] = useState(false);
  const [showAddTeamForm, setShowAddTeamForm] = useState(false);
  const [teams, setTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(true);

  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/teams/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setTeams(data.teams);
      } else {
        alert(data.message || "Failed to fetch teams");
      }
    } catch (err) {
      console.error("Error fetching teams:", err);
      alert("Server error while fetching teams.");
    } finally {
      setLoadingTeams(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <div className="p-6 relative">
      {/* Header Row: Title + Action Buttons */}
      <div className="flex justify-between items-center mb-6 flex-wrap">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <div className="flex gap-2 mt-4 sm:mt-0">
          <AddEmployeeButton onClick={() => setShowAddEmployeeForm(true)} />
          <AddTeamButton onClick={() => setShowAddTeamForm(true)} />
        </div>

      </div>

      {/* Stats Grid */}
      <DashboardStatsGrid />

      {/* Forms */}
      {showAddTeamForm && (
        <AddTeamForm onClose={() => setShowAddTeamForm(false)} />
      )}
      {showAddEmployeeForm && (
        <AddEmployeeForm onClose={() => setShowAddEmployeeForm(false)} />
      )}

      {/* Today's Attendance */}
      <TodayAttendanceTable />
    </div>
  );
}
