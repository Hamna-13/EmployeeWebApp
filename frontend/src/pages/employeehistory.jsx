import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function EmployeeHistory() {
  const { id } = useParams();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/attendance/employee/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setRecords(data.attendance);
      } else {
        alert(data.message || "Failed to load attendance");
      }
    } catch {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [id]);

  return (
    <div className="p-6">
      <Link to="/dashboard" className="text-blue-600 underline mb-4 inline-block">
        Back
      </Link>
      <h1 className="text-2xl font-bold mb-4">Employee Attendance History</h1>

      {loading ? (
        <p>Loading...</p>
      ) : records.length === 0 ? (
        <p>No attendance records found.</p>
      ) : (
        <table className="table-auto w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Check-In</th>
              <th className="border px-4 py-2">Check-Out</th>
              <th className="border px-4 py-2">Worked Time</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec) => (
              <tr key={rec._id}>
                <td className="border px-4 py-1">{rec.date}</td>
                <td className="border px-4 py-1">
                  {rec.checkInTime ? new Date(rec.checkInTime).toLocaleTimeString() : "N/A"}
                </td>
                <td className="border px-4 py-1">
                  {rec.checkOutTime ? new Date(rec.checkOutTime).toLocaleTimeString() : "N/A"}
                </td>
                <td className="border px-4 py-1">{rec.totalWorked}</td>
                <td className="border px-4 py-1"><button>
                    <Link
    to={`/attendance/${rec._id}`}
    className="text-blue-600 hover:underline"
  >
    View Details
  </Link>
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
