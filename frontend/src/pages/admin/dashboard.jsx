import React from 'react';
import Stats from '../../components/admin/stats';
import CompaniesTable from '../../components/admin/companiestable';

export default function AdminDashboard() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      {/* Heading + Date */}
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <span className="text-md text-gray-600">{currentDate}</span>
      </div>

      {/* Subheading */}
      <p className="text-gray-600 mb-6">Welcome to the admin dashboard.</p>

      {/* Stats */}
      <div className="">
        <Stats />
      </div>

      {/* Companies Table */}
      <div>
        <CompaniesTable />
      </div>
    </div>
  );
}
