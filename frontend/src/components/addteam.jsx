import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function AddTeamForm({ onClose }) {
  const [teamName, setTeamName] = useState('');
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/employees/list', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setEmployees(data.employees || []);
    };
    fetchEmployees();
  }, []);

  const handleCheckboxChange = (id) => {
    setSelectedEmployees(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/teams/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: teamName, members: selectedEmployees }),
    });
    const data = await res.json();
    if (res.ok) {
  Swal.fire({
  icon: 'success',
  title: 'Team Created',
  html: `The team <strong>${teamName}</strong> created successfully!`,
  showConfirmButton: true,
  confirmButtonText: 'OK',
  customClass: {
    confirmButton:
      'bg-sky-600 hover:bg-amber-500 text-white px-8 py-2 text-sm font-medium rounded transition-colors duration-200',
  },
  buttonsStyling: false, // Disable default styles so Tailwind can apply
});

  onClose();
} else {
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: data.message || 'Failed to create team',
    confirmButtonColor: '#ef4444',
    confirmButtonText: 'OK',
    customClass: {
      confirmButton: 'px-6 py-2 text-sm font-medium rounded',
    },
  });
}


  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg relative">
  {/* Header */}
  <div className="bg-sky-600 text-white px-6 py-3 rounded-t-lg flex justify-between items-center">
    <h2 className="text-lg font-semibold">Add Team</h2>
    <button
      className="text-white text-2xl leading-none"
      onClick={onClose}
    >
      &times;
    </button>
  </div>

  {/* Body */}
  <div className="p-6">
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Team Name"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        required
        className="w-full p-2 border border-gray-300 mb-4 rounded"
      />

      <div className="max-h-48 overflow-y-auto border border-gray-200 p-2 rounded mb-4">
        {employees.map((emp) => (
          <label key={emp._id} className="flex items-center gap-2 mb-1">
            <input
              type="checkbox"
              checked={selectedEmployees.includes(emp._id)}
              onChange={() => handleCheckboxChange(emp._id)}
            />
            {emp.name} ({emp.email})
          </label>
        ))}
      </div>

      <button
        type="submit"
        className="bg-sky-600 text-white px-6 py-2 rounded hover:bg-amber-500 block mx-auto"
      >
        Create Team
      </button>
    </form>
  </div>
</div>

    </div>
  );
}
