import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

export default function MyProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/employees/myprofile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setProfile(res.data);
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p className="p-6 text-gray-500">Loading...</p>;
  if (!profile) return <p className="p-6 text-red-500">Profile not found.</p>;

  return (
    <div className="p-6 min-h-[80vh]">
      <h2 className="text-2xl font-bold mb-8">My Profile</h2>

      <div className="bg-white rounded-xl shadow-md max-w-4xl mx-auto p-8 min-h-[300px] flex flex-col md:flex-row gap-8 items-center">
        
        {/* Avatar */}
        <div className="w-36 h-36 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-4xl font-bold shadow-sm">
          {profile?.name?.charAt(0) || '?'}
        </div>

        {/* Details */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-base w-full">
          <div className="flex items-center gap-2">
            <i className="fa fa-user text-blue-500" />
            <span><strong>Name:</strong> {profile.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="fa fa-envelope text-blue-500" />
            <span><strong>Email:</strong> {profile.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="fa fa-calendar text-blue-500" />
            <span><strong>Joining Date:</strong> {format(new Date(profile.joinedOn), 'dd MMM yyyy')}</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="fa fa-users text-blue-500" />
            <span><strong>Team:</strong> {profile.team || '—'}</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="fa fa-clock text-blue-500" />
            <span><strong>Total Attendance:</strong> {profile.totalAttendanceDays}</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="fa fa-sign-in-alt text-blue-500" />
            <span><strong>Last Check-in:</strong> {profile.lastCheckIn ? format(new Date(profile.lastCheckIn), 'hh:mm a, dd MMM') : '—'}</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="fa fa-sign-out-alt text-blue-500" />
            <span><strong>Last Check-out:</strong> {profile.lastCheckOut ? format(new Date(profile.lastCheckOut), 'hh:mm a, dd MMM') : '—'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
