import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function AttendanceDetails() {
  const { id } = useParams();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/attendance/record/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setRecord(data);
        } else {
          alert(data.message);
        }
      } catch {
        alert("Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id]);

  const formatTime = (time) => time ? new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A";
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const formatDuration = (ms) => {
    if (!ms || isNaN(ms)) return "00:00:00";
    const totalSec = Math.floor(ms / 1000);
    const h = String(Math.floor(totalSec / 3600)).padStart(2, "0");
    const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
    const s = String(totalSec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  if (loading) return <div className="p-6"><p>Loading...</p></div>;
  if (!record) return <div className="p-6"><p>Record not found.</p></div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Attendance Details</h1>
        <span className="text-gray-600 text-sm">{formatDate(record.date)}</span>
      </div>
      {/* Info Box */}
<div className="shadow-sm bg-white border border-gray-200 rounded px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-y-4 text-sm">
  <div className="flex gap-2">
    <span className="font-semibold text-gray-800 min-w-[130px]">Check-In:</span>
    <span>{formatTime(record.checkInTime)}</span>
  </div>
  <div className="flex gap-2">
    <span className="font-semibold text-gray-800 min-w-[130px]">Check-Out:</span>
    <span>{formatTime(record.checkOutTime)}</span>
  </div>
  <div className="flex gap-2">
    <span className="font-semibold text-gray-800 min-w-[130px]">Total Work Time:</span>
    <span>{record.totalWorked}</span>
  </div>
  <div className="flex gap-2">
    <span className="font-semibold text-gray-800 min-w-[130px]">Total Break Time:</span>
    <span>{record.totalBreakTime}</span>
  </div>
</div>


      {/* Breaks Table Box */}
      <div className="bg-white border border-gray-200 rounded px-6 py-4">
        <h2 className="font-semibold text-md mb-3">Breaks</h2>
        {record.breaks.length === 0 ? (
          <p className="text-sm text-gray-500">No breaks taken.</p>
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
                {record.breaks.map((b, idx) => {
                  const duration = new Date(b.end) - new Date(b.start);
                  return (
                    <tr key={idx}>
                      <td className="px-4 py-2">{formatTime(b.start)}</td>
                      <td className="px-4 py-2">{formatTime(b.end)}</td>
                      <td className="px-4 py-2">{formatDuration(duration)}</td>
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
