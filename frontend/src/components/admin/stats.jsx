import React, { useEffect, useState } from "react";
import axios from "axios";
import { HiBuildingOffice2 } from "react-icons/hi2";

export default function Stats() {
  const [companyCount, setCompanyCount] = useState(null);

  useEffect(() => {
    const fetchCompanyCount = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/admin/companies/count", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompanyCount(res.data.count);
      } catch (err) {
        console.error("Error fetching company count:", err);
      }
    };

    fetchCompanyCount();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
      <StatCard
        title="Total Companies"
        count={companyCount}
        icon={<HiBuildingOffice2 className="text-3xl text-white" />}
        iconBg="bg-sky-600"
      />
    </div>
  );
}

function StatCard({ title, count, icon, iconBg }) {
  return (
    <div className="bg-white rounded-md p-6 flex items-center justify-between border border-gray-200 shadow-sm">
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
