// src/pages/admin/CompanyDetails.jsx

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import CompanyStats from '../../components/admin/companystats';
import Teams from '../../components/admin/teams';
import Employees from '../../components/admin/employees';

export default function CompanyDetails() {
  const { id: companyId } = useParams();
  const [activeTab, setActiveTab] = useState('teams');

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Company Details</h1>

      {/* Stats */}
      <CompanyStats companyId={companyId} />

      {/* Tabs */}
      <div className="mt-6 border-b border-gray-200">
        <nav className="-mb-px flex gap-4">
          <button
            onClick={() => setActiveTab('teams')}
            className={`px-4 py-2 font-medium border-b-2 ${activeTab === 'teams' ? 'border-sky-600 text-sky-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Teams
          </button>
          <button
            onClick={() => setActiveTab('employees')}
            className={`px-4 py-2 font-medium border-b-2 ${activeTab === 'employees' ? 'border-sky-600 text-sky-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Employees
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'teams' ? (
        <Teams companyId={companyId} />
      ) : (
        <Employees companyId={companyId} />
      )}
    </div>
  );
}
