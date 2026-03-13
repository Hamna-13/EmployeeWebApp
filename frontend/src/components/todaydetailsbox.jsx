import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function TodaysDetailsBox() {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:5000/api/attendance/today', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setDetails(res.data))
      .catch((err) => console.error('Error fetching today details:', err));
  }, []);

  const safeTime = (ts) => {
    try {
      return ts ? new Date(ts).toLocaleTimeString() : '—';
    } catch {
      return '—';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 w-full h-full overflow-y-auto max-h-[350px]">
      <h2 className="text-lg font-semibold mb-4">Today’s Attendance Details</h2>

      {!details ? (
        <p className="text-gray-600">No check-in today.</p>
      ) : (
        <div className="text-sm text-gray-700">
          {/* Two-row, two-column grid so columns align */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            <div className="flex items-baseline">
              <span className="font-semibold mr-2">Check-In:</span>
              <span className="tabular-nums">{safeTime(details.checkInTime)}</span>
            </div>
            <div className="flex items-baseline">
              <span className="font-semibold mr-2">Check-Out:</span>
              <span className="tabular-nums">
                {details.checkOutTime ? safeTime(details.checkOutTime) : 'Not yet'}
              </span>
            </div>

            <div className="flex items-baseline">
              <span className="font-semibold mr-2">Total Worked:</span>
              <span className="tabular-nums">{details.totalWorked || '00:00:00'}</span>
            </div>
            <div className="flex items-baseline">
              <span className="font-semibold mr-2">Total Break:</span>
              <span className="tabular-nums">{details.totalBreakTime || '00:00:00'}</span>
            </div>
          </div>

          {/* Breaks Table */}
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Breaks</h3>
            {details.breaks?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full border text-sm text-gray-700">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="px-4 py-2 border">#</th>
                      <th className="px-4 py-2 border">Start Time</th>
                      <th className="px-4 py-2 border">End Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.breaks.map((b, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border">{index + 1}</td>
                        <td className="px-4 py-2 border">{safeTime(b.start)}</td>
                        <td className="px-4 py-2 border">
                          {b.end ? safeTime(b.end) : 'Ongoing'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No breaks recorded.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
