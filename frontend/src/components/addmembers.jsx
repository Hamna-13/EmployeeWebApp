import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function AddMembersModal({
  teamId,
  existingMembers = [],
  onClose,
  onMembersAdded
}) {
  const [allEmployees, setAllEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const fetchAllEmployees = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/employees/list", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setAllEmployees(data.employees || []);
      } else {
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "Failed to fetch employees",
          buttonsStyling: false,
          customClass: {
            confirmButton: "bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-medium"
          }
        });
      }
    } catch {
      await Swal.fire({
        icon: "error",
        title: "Server error",
        text: "Could not load employees",
        buttonsStyling: false,
        customClass: {
          confirmButton: "bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-medium"
        }
      });
    }
  };

  useEffect(() => {
    fetchAllEmployees();
  }, []);

  const employeesNotInTeam = allEmployees.filter(
    emp => !existingMembers.includes(emp._id)
  );

  const toggleSelect = (empId) => {
    setSelectedEmployees(prev =>
      prev.includes(empId) ? prev.filter(id => id !== empId) : [...prev, empId]
    );
  };

  const handleAddMembers = async (e) => {
    e.preventDefault();
    if (selectedEmployees.length === 0) {
      await Swal.fire({
        icon: "info",
        title: "No members selected",
        text: "Please select at least one employee to add",
        buttonsStyling: false,
        customClass: {
          confirmButton: "bg-sky-600 hover:bg-amber-500 text-white px-6 py-2 rounded font-medium"
        }
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/teams/${teamId}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ employeeIds: selectedEmployees })
      });
      const data = await res.json();

      if (!res.ok) {
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "Failed to add members",
          buttonsStyling: false,
          customClass: {
            confirmButton: "bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-medium"
          }
        });
        return;
      }

      await Swal.fire({
        icon: "success",
        title: "Members added",
        text: "Selected members have been added to the team",
        buttonsStyling: false,
        customClass: {
          confirmButton: "bg-sky-600 hover:bg-amber-500 text-white px-8 py-2 rounded font-medium"
        },
        confirmButtonText: "OK"
      });

      onMembersAdded?.();
      onClose();
    } catch {
      await Swal.fire({
        icon: "error",
        title: "Server error",
        text: "Could not add members right now",
        buttonsStyling: false,
        customClass: {
          confirmButton: "bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-medium"
        }
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg relative">
        {/* Header */}
        <div className="bg-sky-600 text-white px-6 py-3 rounded-t-lg flex justify-between items-center">
          <h2 className="text-lg font-semibold">Add Members</h2>
          <button className="text-white text-2xl leading-none" onClick={onClose}>
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <form onSubmit={handleAddMembers}>
            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded p-3 space-y-1">
              {employeesNotInTeam.length === 0 ? (
                <p className="text-sm text-gray-500">No available employees to add</p>
              ) : (
                employeesNotInTeam.map(emp => (
                  <label key={emp._id} className="flex items-center gap-2 py-1">
                    <input
                      type="checkbox"
                      checked={selectedEmployees.includes(emp._id)}
                      onChange={() => toggleSelect(emp._id)}
                    />
                    <span>{emp.name} ({emp.email})</span>
                  </label>
                ))
              )}
            </div>

            <div className="mt-6 flex justify-center gap-4">
              <button
                type="button"
                onClick={onClose}
                className="w-28 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-28 bg-sky-600 hover:bg-amber-500 text-white px-4 py-2 rounded font-medium"
              >
                Add
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
