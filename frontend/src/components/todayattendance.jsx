import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

export default function TodayAttendanceTable() {
  const [data, setData] = useState([]);

  const fetchAttendance = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/attendance/today/company', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = await res.json();
    if (res.ok) setData(result.attendance);
    else alert(result.message || 'Failed to load attendance');
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <div className="bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 mt-6">
      <strong className="text-gray-700 font-medium">Today's Attendance</strong>
            <div className="mt-3">
        {data.length > 0 ? (
          <div className="border-x border-gray-200 rounded-sm overflow-x-auto">
            <table className="w-full text-sm text-gray-700 whitespace-nowrap">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-2">Employee Name</th>
                  <th className="px-4 py-2">Team</th>
                  <th className="px-4 py-2">Check-in</th>
                  <th className="px-4 py-2">Check-out</th>
                  <th className="px-4 py-2">Worked Hours</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.id} className="border-b">
                    <td className="px-4 py-2">{row.employeeName}</td>
                    <td className="px-4 py-2">{row.teamName}</td>
                    <td className="px-4 py-2">{format(new Date(row.checkInTime), 'hh:mm a')}</td>
                    <td className="px-4 py-2">{row.checkOutTime ? format(new Date(row.checkOutTime), 'hh:mm a') : '—'}</td>
                    <td className="px-4 py-2">{row.totalWorked || '00:00:00'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-sm px-4 py-3">No check-ins yet for today.</p>
        )}
      </div>

    </div>
  );
}
