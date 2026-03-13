import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function RecentAttendance() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:5000/api/attendance/recent', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setRecords(res.data.attendance || []))
      .catch(err => console.error('Error fetching recent attendance:', err));
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 w-full h-full overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Recent Attendance (Last 3 Days)</h2>
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Check In</th>
            <th className="px-4 py-2">Check Out</th>
            <th className="px-4 py-2">Worked</th>
          </tr>
        </thead>
        <tbody>
          {records.length > 0 ? (
            records.map((a, i) => (
              <tr key={i} className="border-t">
                <td className="px-4 py-2">{a.date}</td>
                <td className="px-4 py-2">{a.checkInTime?.split('T')[1]?.split('.')[0] || '-'}</td>
                <td className="px-4 py-2">{a.checkOutTime?.split('T')[1]?.split('.')[0] || '-'}</td>
                <td className="px-4 py-2">{a.totalWorked || '-'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-4 py-2 text-gray-500" colSpan={4}>No recent records.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
