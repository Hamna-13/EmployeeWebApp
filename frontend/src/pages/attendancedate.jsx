import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function AttendanceDetailsPage() {
  const { date } = useParams();
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/attendance/${date}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.details) {
          setDetails(data.details);
        } else {
          alert(data.message || "Failed to fetch attendance details");
          setDetails([]);
        }
      } catch (err) {
        alert("Server error while fetching details");
        setDetails([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [date]);

  const formatTime = (iso) => {
    if (!iso) return "—";
    const date = new Date(iso);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (rawDate) => {
    const d = new Date(rawDate);
    return d.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Attendance</h1>
        <span className="text-sm text-gray-600">{formatDate(date)}</span>
      </div>

      <div className="bg-white rounded border border-gray-200 shadow px-6 py-4">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Employee Name</th>
                  <th className="px-4 py-2">Check-In</th>
                  <th className="px-4 py-2">Check-Out</th>
                  <th className="px-4 py-2">Worked Hours</th>
                </tr>
              </thead>
              <tbody>
                {details.length === 0 ? (
                  <tr>
                    <td className="px-4 py-2" colSpan={4}>
                      No records found for this date.
                    </td>
                  </tr>
                ) : (
                  details.map((d, index) => (
                    <tr
                      key={index}
                      className="border hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/attendance/record/${d._id}`)}
                    >
                      <td className="px-4 py-2">{d.employeeName}</td>
                      <td className="px-4 py-2">{formatTime(d.checkInTime)}</td>
                      <td className="px-4 py-2">{formatTime(d.checkOutTime)}</td>
                      <td className="px-4 py-2">{d.totalWorked || "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
