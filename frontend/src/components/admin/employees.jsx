import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Employees({ companyId }) {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `http://localhost:5000/api/admin/company/${companyId}/employees`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEmployees(res.data.employees);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, [companyId]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/employee/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(employees.filter((e) => e._id !== id));
    } catch (error) {
      console.error('Failed to delete employee:', error);
    }
  };

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full text-sm text-left text-gray-700 bg-white border rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Team</th>
            <th className="px-4 py-2">Joining Date</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp._id} className="border hover:bg-gray-50">
              <td className="px-4 py-2">{emp.name}</td>
              <td className="px-4 py-2">{emp.email}</td>
              <td className="px-4 py-2">{emp.teamId?.name || 'N/A'}</td>
              <td className="px-4 py-2">
                {emp.createdAt ? new Date(emp.createdAt).toLocaleDateString() : 'N/A'}
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() => handleDelete(emp._id)}
                  className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
