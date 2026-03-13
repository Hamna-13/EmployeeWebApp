import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function EmpAttendanceDetails() {
  const { id } = useParams();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fmtTime = (t) =>
    t ? new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "N/A";

  const fmtDate = (d) => {
    if (!d) return "N/A";
    const dt = new Date(d);
    return dt.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const fmtDur = (ms) => {
    if (!ms || isNaN(ms)) return "00:00:00";
    const totalSec = Math.floor(ms / 1000);
    const h = String(Math.floor(totalSec / 3600)).padStart(2, "0");
    const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
    const s = String(totalSec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/employeelogin");
      return;
    }

    const fetchRecord = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/attendance/employee/attendance/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRecord(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load attendance details");
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id, navigate]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!record) return <div className="p-6">Record not found</div>;

  const breaks = Array.isArray(record.breaks) ? record.breaks : [];

  return (
    <div className="p-6 space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Attendance Details</h1>
        <span className="text-sm text-gray-600">{fmtDate(record.date)}</span>
      </div>

      {/* Summary card */}
      <div className="shadow-sm bg-white border border-gray-200 rounded px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-y-4 text-sm">
        <div className="flex gap-2">
          <span className="font-semibold text-gray-800 min-w-[130px]">Check In</span>
          <span>{fmtTime(record.checkInTime)}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-semibold text-gray-800 min-w-[130px]">Check Out</span>
          <span>{fmtTime(record.checkOutTime)}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-semibold text-gray-800 min-w-[130px]">Total Work</span>
          <span>{record.totalWorked || "00:00:00"}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-semibold text-gray-800 min-w-[130px]">Total Break</span>
          <span>{record.totalBreakTime || "00:00:00"}</span>
        </div>
      </div>

      {/* Breaks table */}
      <div className="bg-white border border-gray-200 rounded px-6 py-4">
        <h2 className="font-semibold text-md mb-3">Breaks</h2>
        {breaks.length === 0 ? (
          <p className="text-sm text-gray-500">No breaks recorded</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm text-left text-gray-700">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Start</th>
                  <th className="px-4 py-2">End</th>
                  <th className="px-4 py-2">Duration</th>
                </tr>
              </thead>
              <tbody>
                {breaks.map((b, idx) => {
                  const duration =
                    b?.start && b?.end ? new Date(b.end) - new Date(b.start) : 0;
                  return (
                    <tr key={idx} className="border-t">
                      <td className="px-4 py-2">{fmtTime(b?.start)}</td>
                      <td className="px-4 py-2">{fmtTime(b?.end)}</td>
                      <td className="px-4 py-2">{fmtDur(duration)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
