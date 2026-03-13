import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { HiMiniUserGroup } from 'react-icons/hi2';
import AddTeamButton from '../components/addteambtn';
import AddTeamForm from '../components/addteam'; 

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [showAddTeam, setShowAddTeam] = useState(false);

  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/teams/list', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) setTeams(res.data.teams);
    } catch (error) {
      console.error('Failed to fetch teams:', error);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <div className="p-6">
      {/* Top header with title and button */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h1 className="text-2xl font-bold">Teams</h1>
        <AddTeamButton onClick={() => setShowAddTeam(true)} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {teams.map(team => (
          <Link
            to={`/teams/${team._id}`}
            key={team._id}
            className="bg-white border border-gray-200 rounded-md p-6 shadow-sm hover:shadow-md transition cursor-pointer flex items-center justify-between"
          >
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <div className="rounded-full h-20 w-20 flex items-center justify-center bg-sky-600 hover:bg-amber-500">
                <HiMiniUserGroup className="text-white text-5xl" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-800">{team.name}</p>
              </div>
            </div>

            {/* Right Section */}
            <div className="text-right">
              <div className="text-4xl font-bold">{team.members.length}</div>
              <div className="text-sm text-gray-500">
                {team.members.length === 1 ? 'Member' : 'Members'}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Add Team Modal */}
      {showAddTeam && (
        <AddTeamForm
          onClose={() => setShowAddTeam(false)}
          // after successful creation, close and refresh
          onCreated={() => {
            setShowAddTeam(false);
            fetchTeams();
          }}
        />
      )}
    </div>
  );
}
