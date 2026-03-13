import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MyTeamPage() {
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loggedInId, setLoggedInId] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);

        const res = await axios.get('http://localhost:5000/api/employees/myteam', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        setTeam(res.data.team);
        setMembers(res.data.members);

        const token = localStorage.getItem('token');
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setLoggedInId(payload.userId);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching team info:', err);
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  return (
    <div className="p-4">
      {loading ? (
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Loading...</h2>
      ) : team ? (
        <h2 className="text-2xl font-bold mb-4">{team.name}</h2>
      ) : (
        <h2 className="text-2xl font-semibold mb-4 text-red-500">No team assigned</h2>
      )}

      {members.length > 0 ? (
        <div className="bg-white px-4 pt-4 pb-4 rounded-sm border border-gray-200 mt-6">
        <div className="overflow-x-auto border border-gray-300 rounded">
          <table className="min-w-full text-sm table-auto">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-2 border-b">Name</th>
                <th className="px-4 py-2 border-b">Email</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr
                  key={member._id}
                  className={`${member._id === loggedInId ? 'bg-white' : ''}`}
                >
                  <td className="px-4 py-2 border-b">
                    {member.name}
                    {member._id === loggedInId && (
                      <span className="text-blue-500 text-sm ml-2">(You)</span>
                    )}
                  </td>
                  <td className="px-4 py-2 border-b">{member.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      ) : !loading && team ? (
        <p className="text-gray-600 text-sm mt-2">No team members found.</p>
      ) : null}
    </div>
  );
}

export default MyTeamPage;
