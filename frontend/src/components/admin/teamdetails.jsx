// src/components/admin/company/TeamDetails.jsx

import React from 'react';

export default function TeamDetails({ team, onClose }) {
  if (!team) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-600 hover:text-black text-2xl"
        >
          &times;
        </button>

        {/* Modal Title */}
        <h2 className="text-2xl font-bold mb-4">{team.name} - Members</h2>

        {/* Table */}
        {team.members && team.members.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-t border-gray-200">
              <thead>
                <tr className="text-gray-600 bg-gray-50">
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Email</th>
                </tr>
              </thead>
              <tbody>
                {team.members.map((member) => (
                  <tr key={member._id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{member.name}</td>
                    <td className="py-2 px-4">{member.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No members found in this team.</p>
        )}
      </div>
    </div>
  );
}
