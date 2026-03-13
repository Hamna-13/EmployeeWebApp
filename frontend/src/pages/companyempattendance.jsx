import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EmployeeAttendanceList() {
  const { employeeId } = useParams();
  const navigate = useNavigate();

  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchPage = async (p = 1) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/attendance/employee/${employeeId}/records?page=${p}&limit=10`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (res.ok) {
        setRecords(data.records || []);
        setPage(data.currentPage || p);
        setTotalPages(data.totalPages || 1);
      } else {
        alert(data.message || "Failed to load attendance");
      }
    } catch {
      alert("Server error while loading attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employeeId) fetchPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId]);

  const goToPage = (p) => {
    if (p >= 1 && p <= totalPages) {
      setLoading(true);
      fetchPage(p);
    }
  };

  if (loading) return <div className="p-6">Loading attendance...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Employee Attendance</h1>

      <div className="bg-white px-4 pt-4 pb-4 rounded-sm border border-gray-200">
        <div className="rounded shadow overflow-x-auto border border-gray-200">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Check in</th>
                <th className="px-4 py-2">Check out</th>
                <th className="px-4 py-2">Worked</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td className="px-4 py-3" colSpan={4}>
                    No records found.
                  </td>
                </tr>
              ) : (
                records.map((rec) => (
                  <tr
                    key={rec._id}
                    className="border-t hover:bg-gray-50 cursor-pointer"
                    onClick={() =>
                      navigate(`/employees/${employeeId}/attendance/${rec._id}`)
                    }
                  >
                    <td className="px-4 py-2">{rec.date}</td>
                    <td className="px-4 py-2">
                      {rec.checkInTime
                        ? new Date(rec.checkInTime).toLocaleTimeString()
                        : "—"}
                    </td>
                    <td className="px-4 py-2">
                      {rec.checkOutTime
                        ? new Date(rec.checkOutTime).toLocaleTimeString()
                        : "—"}
                    </td>
                    <td className="px-4 py-2">{rec.totalWorked || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination identical style */}
        {records.length > 0 && (
          <div className="flex justify-end items-center mt-4 gap-2">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => goToPage(p)}
                className={`px-3 py-1 border rounded ${
                  page === p ? "bg-sky-600 text-white" : ""
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => goToPage(page + 1)}
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
