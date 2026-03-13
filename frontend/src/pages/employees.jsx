import React, { useEffect, useState } from "react";
import EditEmployeeForm from "../components/editemployee";
import AddEmployeeForm from "../components/addemployee";
import AddEmployeeButton from "../components/addemployeebtn";
import ConfirmModal from "../components/confirmmodal";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function EmployeesTable() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // delete confirm modal
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null); // { _id, name, email }

  const fetchEmployees = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/company/employees/company", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (res.ok) setEmployees(result.employees);
      else {
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: result.message || "Failed to load employees",
          buttonsStyling: false,
          customClass: {
            confirmButton:
              "bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-medium",
          },
        });
      }
    } catch {
      await Swal.fire({
        icon: "error",
        title: "Server error",
        text: "Something went wrong fetching employees",
        buttonsStyling: false,
        customClass: {
          confirmButton:
            "bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-medium",
        },
      });
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSave = async (employeeId, updatedData) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/api/employees/${employeeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      const result = await res.json();
      if (res.ok) {
        setEditingEmployee(null);
        await Swal.fire({
          icon: "success",
          title: "Employee updated",
          buttonsStyling: false,
          customClass: {
            confirmButton:
              "bg-sky-600 hover:bg-amber-500 text-white px-8 py-2 rounded font-medium",
          },
          confirmButtonText: "OK",
        });
        fetchEmployees();
      } else {
        await Swal.fire({
          icon: "error",
          title: "Update failed",
          text: result.message || "Failed to update employee",
          buttonsStyling: false,
          customClass: {
            confirmButton:
              "bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-medium",
          },
        });
      }
    } catch {
      await Swal.fire({
        icon: "error",
        title: "Server error",
        text: "Error updating employee",
        buttonsStyling: false,
        customClass: {
          confirmButton:
            "bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-medium",
        },
      });
    }
  };

  // open delete confirmation
  const askDelete = (emp) => {
    setPendingDelete(emp);
    setConfirmDeleteOpen(true);
  };

  // confirmed delete
  const confirmDelete = async () => {
    const employeeId = pendingDelete?._id;
    const removed = pendingDelete; // keep for toast text
    setConfirmDeleteOpen(false);
    setPendingDelete(null);

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/api/employees/${employeeId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();
      if (res.ok) {
        await Swal.fire({
          icon: "success",
          title: "Employee deleted",
          html: `The employee <strong>${removed?.name || "Record"}</strong> has been deleted.`,
          buttonsStyling: false,
          customClass: {
            confirmButton:
              "bg-sky-600 hover:bg-amber-500 text-white px-8 py-2 rounded font-medium",
          },
          confirmButtonText: "OK",
        });
        fetchEmployees();
      } else {
        await Swal.fire({
          icon: "error",
          title: "Delete failed",
          text: result.message || "Could not delete employee",
          buttonsStyling: false,
          customClass: {
            confirmButton:
              "bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-medium",
          },
        });
      }
    } catch {
      await Swal.fire({
        icon: "error",
        title: "Server error",
        text: "Error deleting employee",
        buttonsStyling: false,
        customClass: {
          confirmButton:
            "bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-medium",
        },
      });
    }
  };

  return (
    <div className="p-6">
      {/* Title and Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
        <h1 className="text-2xl font-bold">Employees</h1>
        <AddEmployeeButton onClick={() => setShowAddForm(true)} />
      </div>

      <div className="bg-white p-6 rounded border border-gray-200">
        {employees.length === 0 ? (
          <p>No employees found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-100 text-left text-sm font-medium text-gray-700">
                <tr>
                  <th className="px-4 py-2 border-b">Name</th>
                  <th className="px-4 py-2 border-b">Email</th>
                  <th className="px-4 py-2 border-b">Team</th>
                  <th className="px-4 py-2 border-b"></th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {employees.map((emp) => (
                  <tr key={emp._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{emp.name}</td>
                    <td className="px-4 py-2">{emp.email}</td>
                    <td className="px-4 py-2">{emp.teamName || "—"}</td>
                    <td className="px-4 py-2 text-right space-x-2">
                      <button
                        onClick={() => navigate(`/employees/${emp._id}/attendance`)}
                        className="px-4 py-2 rounded bg-sky-600 text-white hover:bg-sky-700"
                      >
                        View Attendance
                      </button>
                      <button
                        onClick={() => setEditingEmployee(emp)}
                        className="w-20 px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => askDelete(emp)}
                        className="w-20 px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit modal */}
      {editingEmployee && (
        <EditEmployeeForm
          employee={editingEmployee}
          onClose={() => setEditingEmployee(null)}
          onSave={handleSave}
        />
      )}

      {/* Add modal */}
      {showAddForm && (
        <AddEmployeeForm
          onClose={() => {
            setShowAddForm(false);
            fetchEmployees();
          }}
        />
      )}

      {/* Delete confirmation modal with sky header and centered equal width buttons */}
      {confirmDeleteOpen && pendingDelete && (
        <ConfirmModal
          title="Delete Employee"
          message={
            <>
              Are you sure you want to delete{" "}
              <strong>{pendingDelete.name}</strong> ({pendingDelete.email})?
            </>
          }
          confirmText="Delete"
          cancelText="Cancel"
          danger
          onConfirm={confirmDelete}
          onClose={() => setConfirmDeleteOpen(false)}
        />
      )}
    </div>
  );
}
