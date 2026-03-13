import React, { useState } from "react";

export default function AddEmployeeForm({ onClose }) {
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/employees/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: employeeEmail,
          name: employeeName,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setGeneratedPassword(data.password);
        alert(
          `Employee added successfully!\n\nEmail: ${data.email}\nName: ${data.name}\nPassword: ${data.password}`
        );
        setEmployeeEmail("");
        setEmployeeName("");
        onClose();
      } else {
        alert(data.message || "Error adding employee.");
      }
    } catch (err) {
      alert("Server error.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative">
        
        {/* Header */}
        <div className="bg-sky-600 text-white px-6 py-3 rounded-t-lg flex justify-between items-center">
          <h2 className="text-lg font-semibold">Add Employee</h2>
          <button
            className="text-white text-2xl leading-none"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <form onSubmit={handleAddEmployee}>
            <input
              type="text"
              placeholder="Employee Name"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              className="w-full p-2 border border-gray-300 mb-4 rounded"
              required
            />
            <input
              type="email"
              placeholder="Employee Email"
              value={employeeEmail}
              onChange={(e) => setEmployeeEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 mb-4 rounded"
              required
            />

            {/* Password shown after successful addition */}
            {generatedPassword && (
              <div className="mb-4">
                <p className="text-sm text-green-700 font-medium">
                  Generated Password:{" "}
                  <span className="font-mono">{generatedPassword}</span>
                </p>
              </div>
            )}

            <button
              type="submit"
              className="bg-sky-600 text-white px-6 py-2 rounded hover:bg-amber-500 block mx-auto"
            >
              Submit
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
