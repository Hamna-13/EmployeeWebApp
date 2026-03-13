import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

export default function WelcomeSection() {
  const [employee, setEmployee] = useState(null);
  const today = format(new Date(), 'EEEE, MMMM d, yyyy');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios.get('http://localhost:5000/api/employees/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setEmployee(res.data))
    .catch(err => {
      console.error('Failed to fetch employee data:', err);
      setEmployee(null);
    });
  }, []);

  return (
    <div className="mb-6 w-full px-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome{employee?.name ? `, ${employee.name}` : ''}!
        </h2>
        <span className="text-gray-500 font-medium">{today}</span>
      </div>
      <p className="text-gray-600 mt-1">Let’s make today productive.</p>
    </div>
  );
}
