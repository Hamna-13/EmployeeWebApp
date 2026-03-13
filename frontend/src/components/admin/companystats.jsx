import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { HiMiniUserGroup } from 'react-icons/hi2';
import { IoPeople } from 'react-icons/io5';
import { useParams } from 'react-router-dom';

export default function CompanyStats() {
  const { id } = useParams();
  const [stats, setStats] = useState({ teamCount: 0, employeeCount: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/admin/company/${id}/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching company stats:", error);
      }
    };

    fetchStats();
  }, [id]);

  return (
    <div className="flex gap-6 flex-wrap mt-4">
      <StatCard
        title="Total Teams"
        count={stats.teamCount}
        icon={<HiMiniUserGroup className="text-3xl text-white" />}
        iconBg="bg-orange-600"
      />
      <StatCard
        title="Total Employees"
        count={stats.employeeCount}
        icon={<IoPeople className="text-3xl text-white" />}
        iconBg="bg-yellow-500"
      />
    </div>
  );
}

function StatCard({ title, count, icon, iconBg }) {
  return (
    <div className="bg-white rounded-md p-6 flex items-center justify-between min-w-[280px] min-h-[100px] border border-gray-200 shadow-sm flex-1">
      <div className="flex items-center gap-4">
        <div className={`rounded-full h-14 w-14 flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
        <div>
          <h4 className="text-base font-semibold text-gray-800">{title}</h4>
        </div>
      </div>
      <div className="text-4xl font-bold text-gray-900">
        {count !== null ? count : '...'}
      </div>
    </div>
  );
}
