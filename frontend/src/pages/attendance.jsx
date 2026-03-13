import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Calendar
import { DateRange } from "react-date-range";
import { enUS } from "date-fns/locale";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function AttendancePage() {
  const [attendanceSummary, setAttendanceSummary] = useState([]);
  const [filteredSummary, setFilteredSummary] = useState([]);

  // default to last 7 days including today
  const [range, setRange] = useState([
    {
      startDate: new Date(new Date().setDate(new Date().getDate() - 6)),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [showCalendar, setShowCalendar] = useState(false);

  const [page, setPage] = useState(1);
  const itemsPerPage = 7;
  const navigate = useNavigate();
  const calendarRef = useRef(null);

  useEffect(() => {
    const fetchSummary = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/attendance/summary", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        const sorted = data.summary.slice().reverse();
        setAttendanceSummary(sorted);
        applyRangeFilter(sorted, range[0].startDate, range[0].endDate);
      } else {
        alert(data.message || "Failed to fetch attendance summary");
      }
    };

    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalPages = Math.max(1, Math.ceil(filteredSummary.length / itemsPerPage));
  const start = (page - 1) * itemsPerPage;
  const currentRows = filteredSummary.slice(start, start + itemsPerPage);

  // Safe, local-date parser for multiple formats
  const parseEntryDate = (s) => {
    if (!s) return null;

    // 1) strict YYYY-MM-DD -> local date
    const ymd = /^(\d{4})-(\d{2})-(\d{2})$/;
    const m1 = s.match(ymd);
    if (m1) return new Date(Number(m1[1]), Number(m1[2]) - 1, Number(m1[3]));

    // 2) ISO string with time -> native
    if (s.includes("T")) {
      const d = new Date(s);
      return isNaN(d) ? null : d;
    }

    // 3) fallback to Date.parse for other formats like 8/13/2025
    const d2 = new Date(s);
    return isNaN(d2) ? null : d2;
  };

  const startOfDayMs = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

  const isWithinInclusive = (d, s, e) => {
    const dd = startOfDayMs(d);
    const ss = startOfDayMs(s);
    const ee = startOfDayMs(e);
    return dd >= ss && dd <= ee;
  };

  const applyRangeFilter = (source, startDate, endDate) => {
    const end = endDate || startDate;
    const next = source.filter((entry) => {
      const ed = parseEntryDate(entry.date);
      return ed && isWithinInclusive(ed, startDate, end);
    });
    setFilteredSummary(next);
    setPage(1);
  };

  const handleApply = () => {
    const { startDate, endDate } = range[0];
    applyRangeFilter(attendanceSummary, startDate, endDate || startDate);
    setShowCalendar(false);
  };

  const handleClear = () => {
    setFilteredSummary(attendanceSummary);
    setRange([
      {
        startDate: new Date(new Date().setDate(new Date().getDate() - 6)),
        endDate: new Date(),
        key: "selection",
      },
    ]);
    setPage(1);
    setShowCalendar(false);
  };

  const goToPage = (p) => {
    if (p >= 1 && p <= totalPages) setPage(p);
  };

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const placeholderText = `${range[0].startDate.toLocaleDateString()} - ${(range[0].endDate || range[0].startDate).toLocaleDateString()}`;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Attendance</h1>

      {/* Compact "Select date range" control */}
      <div className="relative mb-4 w-full max-w-md">
        <button
          onClick={() => setShowCalendar((v) => !v)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-left text-gray-800 hover:border-gray-400"
          aria-haspopup="dialog"
          aria-expanded={showCalendar}
        >
          {placeholderText}
        </button>

        {showCalendar && (
          <div
            ref={calendarRef}
            className="absolute z-50 mt-2 w-fit rounded-lg border border-gray-200 bg-white shadow-lg"
          >
            <DateRange
              ranges={range}
              onChange={(r) => setRange([r.selection])}
              moveRangeOnFirstSelection={false}
              rangeColors={["#0284c7"]}
              months={1}
              direction="horizontal"
              showDateDisplay={false}
              locale={enUS}
            />

            {/* Visible footer bar with buttons */}
            <div className="flex items-center justify-end gap-2 border-t border-gray-200 bg-white px-3 py-2">
              <button
                onClick={handleClear}
                className="px-3 py-1 rounded-lg border border-gray-300 bg-gray-100 text-gray-800 hover:bg-gray-200"
              >
                Reset
              </button>
              <button
                onClick={handleApply}
                className="px-3 py-1 rounded-lg bg-sky-600 text-white hover:bg-sky-700"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white px-4 pt-4 pb-4 rounded-sm border border-gray-200">
        <div className="rounded shadow overflow-x-auto border border-gray-200">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Employees Checked In</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.length === 0 ? (
                <tr>
                  <td className="px-4 py-3" colSpan={2}>
                    No records found.
                  </td>
                </tr>
              ) : (
                currentRows.map((entry) => (
                  <tr
                    key={entry.date}
                    onClick={() => navigate(`/attendance/by-date/${entry.date}`)}
                    className="border-t hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-4 py-2">{entry.date}</td>
                    <td className="px-4 py-2">{entry.checkedInCount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredSummary.length > 0 && (
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
                className={`px-3 py-1 border rounded ${page === p ? "bg-sky-600 text-white" : ""}`}
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
