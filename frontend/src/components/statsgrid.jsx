import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IoPeople, IoTime } from 'react-icons/io5';
import { HiMiniUserGroup } from 'react-icons/hi2';

export default function DashboardStatsGrid() {
  const [employeeCount, setEmployeeCount] = useState(null);
  const [teamCount, setTeamCount] = useState(null);
  const [todayCheckIns, setTodayCheckIns] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/company/dashboard-stats', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;
        setEmployeeCount(data.employeeCount);
        setTeamCount(data.teamCount);
        setTodayCheckIns(data.todayCheckIns);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex gap-6 flex-wrap">
      <StatCard
        title="Total Employees"
        count={employeeCount}
        icon={<IoPeople className="text-3xl text-white" />}
        iconBg="bg-yellow-400"
      />
      <StatCard
        title="Total Teams"
        count={teamCount}
        icon={<HiMiniUserGroup className="text-3xl text-white" />}
        iconBg="bg-orange-600"
      />
      <StatCard
        title="Check-ins Today"
        count={todayCheckIns}
        icon={<IoTime className="text-3xl text-white" />}
        iconBg="bg-green-600"
      />
    </div>
  );
}

function StatCard({ title, count, icon, iconBg }) {
  return (
    <div className="bg-white rounded-md p-6 flex items-center justify-between min-w-[280px] min-h-[100px] border border-gray-200 shadow-sm flex-1">
      {/* Left: Icon + Title */}
      <div className="flex items-center gap-4">
        <div className={`rounded-full h-14 w-14 flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
        <div>
          <h4 className="text-base font-semibold text-gray-800">{title}</h4>
          {/* Optional: Add a subtitle or description here if needed */}
          {/* <p className="text-xs text-gray-500">Company-wide</p> */}
        </div>
      </div>

      {/* Right: Count */}
      <div className="text-4xl font-bold text-gray-900">
        {count !== null ? count : '...'}
      </div>
    </div>
  );
}
