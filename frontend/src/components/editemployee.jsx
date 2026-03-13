import React, { useState } from "react";

export default function EditEmployeeForm({ employee, onClose, onSave }) {
  const [name, setName] = useState(employee.name);
  const [email, setEmail] = useState(employee.email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(employee._id, { name, email });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative">
        {/* Header */}
        <div className="bg-sky-600 text-white px-6 py-3 rounded-t-lg flex justify-between items-center">
          <h2 className="text-lg font-semibold">Edit Employee</h2>
          <button
            className="text-white text-2xl leading-none"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-200"
                required
              />
            </div>

            {/* Footer buttons centered and equal width */}
            <div className="mt-6 flex justify-center gap-4">
              <button
                type="submit"
                className="w-32 bg-sky-600 hover:bg-amber-500 text-white px-4 py-2 rounded font-medium"
              >
                Save
              </button>
              <button
                type="button"
                className="w-32 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded font-medium"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
