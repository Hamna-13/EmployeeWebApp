import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function CheckInBox() {
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [timer, setTimer] = useState('00:00:00');
  const [isPaused, setIsPaused] = useState(false);
  const [totalBreakTime, setTotalBreakTime] = useState('00:00:00');
  const intervalRef = useRef(null);
  const pauseRef = useRef(null);
  const totalPauseDurationRef = useRef(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:5000/api/attendance/today', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        const data = res.data;
        if (data.checkInTime && !data.checkOutTime) {
          setHasCheckedIn(true);
          setStartTime(data.checkInTime);
        } else if (data.totalWorked) {
          setTimer(data.totalWorked);
        }
        if (data.totalBreakTime) {
          setTotalBreakTime(data.totalBreakTime);
        }
      })
      .catch((err) => {
        console.log('No active check-in:', err.response?.data?.message);
      });
  }, []);

  useEffect(() => {
    if (hasCheckedIn && startTime && !isPaused) {
      intervalRef.current = setInterval(() => {
        const now = new Date();
        const start = new Date(startTime);
        const adjustedNow = new Date(now - totalPauseDurationRef.current);
        const diff = adjustedNow - start;
        const h = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0');
        const m = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, '0');
        const s = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');
        setTimer(`${h}:${m}:${s}`);
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [hasCheckedIn, startTime, isPaused]);

  const handleCheckIn = async () => {
    const token = localStorage.getItem('token');

    try {
      const res = await axios.post(
        'http://localhost:5000/api/attendance/checkin',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHasCheckedIn(true);
      setStartTime(res.data.checkInTime);

      Swal.fire({
        icon: 'success',
        title: 'Checked in',
        text: 'Have a great shift',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      const message = err.response?.data?.message;
      if (message === 'Already checked in today') {
        Swal.fire({
          icon: 'info',
          title: 'Already checked in',
          text: 'You have already checked in today.'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Check in failed',
          text: 'Please try again.'
        });
      }
    }
  };

  const handleCheckOut = async () => {
    clearInterval(intervalRef.current);
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(
        'http://localhost:5000/api/attendance/checkout',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const worked = res.data.totalWorked || timer;
      const breaks = res.data.totalBreakTime || totalBreakTime;

      Swal.fire({
        icon: 'success',
        title: 'Checked out',
        html: `
          <div style="text-align:left">
            <p><strong>Worked</strong> ${worked}</p>
            <p><strong>Breaks</strong> ${breaks}</p>
          </div>
        `,
        timer: 1800,
        showConfirmButton: false
      });

      setHasCheckedIn(false);
      setStartTime(null);
      setTimer(worked || '00:00:00');
      setIsPaused(false);
      totalPauseDurationRef.current = 0;
      if (res.data.totalBreakTime) {
        setTotalBreakTime(res.data.totalBreakTime);
      }
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Check out failed',
        text: 'Please try again.'
      });
    }
  };

  const handleTogglePause = async () => {
    const token = localStorage.getItem('token');
    try {
      if (isPaused) {
        const resumeTime = new Date();
        const pauseDuration = resumeTime - pauseRef.current;
        totalPauseDurationRef.current += pauseDuration;
        await axios.post('http://localhost:5000/api/attendance/break/end', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire({
          icon: 'success',
          title: 'Resumed work',
          timer: 1200,
          showConfirmButton: false
        });
      } else {
        pauseRef.current = new Date();
        await axios.post('http://localhost:5000/api/attendance/break/start', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire({
          icon: 'info',
          title: 'Break started',
          timer: 1200,
          showConfirmButton: false
        });
      }
      setIsPaused((prev) => !prev);
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Action failed',
        text: 'Please try again.'
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 h-full w-full flex flex-col items-center justify-center text-center p-6">
      <div className="mb-6">
        <h2 className="text-lg text-gray-600 font-semibold mb-2">Worked Time</h2>
        <div className="flex gap-2 justify-center text-4xl font-bold text-gray-800">
          {timer.split(':').map((part, idx) => (
            <React.Fragment key={idx}>
              <div className="w-16 h-20 bg-gray-100 rounded-lg shadow-inner flex items-center justify-center">
                {part}
              </div>
              {idx < 2 && (
                <div className="w-4 h-20 flex items-center justify-center text-4xl font-normal text-gray-600">
                  :
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <p className="text-gray-700 mb-4 font-medium">
        Total Break Time: {totalBreakTime}
      </p>

      <div className="flex flex-wrap justify-center gap-4 mb-4">
        <button
          onClick={handleCheckIn}
          disabled={hasCheckedIn}
          className="w-32 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          Check In
        </button>
        <button
          onClick={handleCheckOut}
          disabled={!hasCheckedIn}
          className="w-32 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
        >
          Check Out
        </button>
      </div>

      {hasCheckedIn && (
        <div className="w-full max-w-[272px]">
          <button
            onClick={handleTogglePause}
            className="w-full px-4 py-2 bg-sky-600 text-white rounded hover:bg-amber-500"
          >
            {isPaused ? 'Resume Work' : 'Take a Break'}
          </button>
        </div>
      )}
    </div>
  );
}
