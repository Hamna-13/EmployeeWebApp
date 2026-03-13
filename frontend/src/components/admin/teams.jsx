import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { HiMiniUserGroup } from 'react-icons/hi2';
import TeamDetails from './teamdetails'; 

export default function Teams({ companyId }) {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/admin/company/${companyId}/teams`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTeams(res.data.teams);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchTeams();
  }, [companyId]);

  const openTeamModal = async (teamId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/admin/teams/${teamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedTeam(res.data.team);
      setIsModalOpen(true);
    } catch (err) {
      console.error('Error fetching team members:', err);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTeam(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 mt-4">
        {teams.map((team) => (
          <div
            key={team._id}
            onClick={() => openTeamModal(team._id)}
            className="cursor-pointer bg-white border border-gray-200 rounded-md p-6 shadow-sm hover:shadow-md transition flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-full h-20 w-20 flex items-center justify-center bg-sky-600 hover:bg-amber-500 transition">
                <HiMiniUserGroup className="text-white text-5xl" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-800">{team.name}</p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-4xl font-bold">{team.members.length}</div>
              <div className="text-sm text-gray-500">
                {team.members.length === 1 ? 'Member' : 'Members'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <TeamDetails team={selectedTeam} onClose={closeModal} />
      )}
    </>
  );
}
