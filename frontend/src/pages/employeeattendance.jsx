import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function EmployeeAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [page, setPage] = useState(1);
  const [searchDate, setSearchDate] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAttendance = async (pageToFetch = 1) => {
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/attendance/employee/history', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: pageToFetch,
          date: searchDate || undefined,
        },
      });

      setAttendance(res.data.attendance || []);
      setTotalPages(res.data.totalPages || 1);
      setPage(pageToFetch);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance(1); // initial load
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAttendance(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchAttendance(newPage);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Attendance</h1>

      <form onSubmit={handleSearch} className="mb-4 flex gap-4">
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded"
        />
        <button type="submit" className="px-4 py-2 bg-sky-600 text-white hover:bg-amber-500 rounded">
          Search
        </button>
      </form>

      <div className="bg-white px-4 pt-4 pb-4 rounded-sm border border-gray-200 mt-6">
        <div className="rounded shadow overflow-x-auto border border-gray-200">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Checked In</th>
                <th className="px-4 py-2">Checked Out</th>
                <th className="px-4 py-2">Worked Time</th>
              </tr>
            </thead>
            <tbody>
              {attendance.length === 0 ? (
                <tr>
                  <td className="px-4 py-2" colSpan={4}>
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                attendance.map((a, index) => (
                  <tr
                    key={index}
                    className="border-t hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/myattendance/details/${a._id}`)}
                  >
                    <td className="px-4 py-2">{a.date}</td>
                    <td className="px-4 py-2">{a.checkInTime?.split('T')[1]?.split('.')[0] || '-'}</td>
                    <td className="px-4 py-2">{a.checkOutTime?.split('T')[1]?.split('.')[0] || '-'}</td>
                    <td className="px-4 py-2">{a.totalWorked}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {attendance.length > 0 && (
          <div className="flex justify-end items-center mt-4 gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 border rounded ${
                  page === i + 1 ? 'bg-sky-600 text-white' : ''
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
