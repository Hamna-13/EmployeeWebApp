import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import { useNavigate } from 'react-router-dom';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function WeeklyHoursChart() {
  const [weeklyData, setWeeklyData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/employeelogin');

    axios.get('http://localhost:5000/api/attendance/weekly-hours', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setWeeklyData(res.data.weeklyData || []);
    })
    .catch(err => {
      console.error('Error fetching weekly data:', err);
      setWeeklyData([]);
    });
  }, [navigate]);

  const chartData = {
    labels: weeklyData.map(d => d.date),
    datasets: [{
      label: 'Worked Hours',
      data: weeklyData.map(d => d.totalWorkedHours),
      backgroundColor: 'rgba(59, 130, 246, 0.6)',
    }]
  };

  const chartOptions = {
  responsive: true,
  scales: {
    y: {
      min: 0,
      max: 9,
      beginAtZero: true,
      title: {
        display: true,
        text: 'Hours'
      },
      ticks: {
        stepSize: 1
      }
    }
  }
};


  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 h-full">

      <h2 className="text-lg font-semibold mb-4">Weekly Working Hours</h2>
      {/* Bar Chart Section */}
      
        <Bar data={chartData} options={chartOptions} />
      
    </div>
  );
}
