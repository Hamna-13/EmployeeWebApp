import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddMembersModal from "../components/addmembers";
import EditTeamNameModal from "../components/editteamname";
import ConfirmModal from "../components/confirmmodal";
import { HiOutlineUserAdd } from "react-icons/hi";
import { FiEdit3 } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import Swal from "sweetalert2";

export default function TeamDetails() {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // confirm modals
  const [confirmDeleteTeamOpen, setConfirmDeleteTeamOpen] = useState(false);
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);
  const [pendingRemove, setPendingRemove] = useState(null); // { id, name, email }

  const fetchTeam = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/teams/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setTeam(data.team);
      } else {
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "Failed to load team",
          buttonsStyling: false,
          customClass: {
            confirmButton:
              "bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-medium",
          },
        });
      }
    } catch {
      await Swal.fire({
        icon: "error",
        title: "Server error",
        text: "Could not load team",
        buttonsStyling: false,
        customClass: {
          confirmButton:
            "bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-medium",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // open confirms
  const openDeleteTeamConfirm = () => setConfirmDeleteTeamOpen(true);
  const openRemoveConfirm = (member) => {
    setPendingRemove(member);
    setConfirmRemoveOpen(true);
  };

  // confirmed actions
  const confirmDeleteTeam = async () => {
    setConfirmDeleteTeamOpen(false);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/teams/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) {
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "Failed to delete team",
          buttonsStyling: false,
          customClass: {
            confirmButton:
              "bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-medium",
          },
        });
        return;
      }

      await Swal.fire({
        icon: "success",
        title: "Team deleted",
        html: `The team <strong>${team.name}</strong> has been deleted successfully.`,
        buttonsStyling: false,
        customClass: {
          confirmButton:
            "bg-sky-600 hover:bg-amber-500 text-white px-8 py-2 rounded font-medium",
        },
        confirmButtonText: "OK",
      });

      window.location.href = "/teams";
    } catch {
      await Swal.fire({
        icon: "error",
        title: "Server error",
        text: "An error occurred while deleting the team",
        buttonsStyling: false,
        customClass: {
          confirmButton:
            "bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-medium",
        },
      });
    }
  };

  const confirmRemoveMember = async () => {
  const employeeId = pendingRemove?.id;
  const removedMember = pendingRemove; // store before clearing
  setConfirmRemoveOpen(false);
  setPendingRemove(null);

  try {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `http://localhost:5000/api/teams/${id}/members/${employeeId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();

    if (!res.ok) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: data.message || "Failed to remove member",
        buttonsStyling: false,
        customClass: {
          confirmButton:
            "bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-medium",
        },
      });
      return;
    }

    await Swal.fire({
      icon: "success",
      title: "Member removed",
      html: `The member <strong>${removedMember.name}</strong> has been removed successfully.`,
      buttonsStyling: false,
      customClass: {
        confirmButton:
          "bg-sky-600 hover:bg-amber-500 text-white px-8 py-2 rounded font-medium",
      },
      confirmButtonText: "OK",
    });

    fetchTeam();
  } catch {
    await Swal.fire({
      icon: "error",
      title: "Server error",
      text: "An error occurred while removing the member",
      buttonsStyling: false,
      customClass: {
        confirmButton:
          "bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-medium",
      },
    });
  }
};


  if (loading) return <p className="p-6">Loading team...</p>;
  if (!team) return <p className="p-6">Team not found</p>;

  const memberIds = team.members.map((m) => m._id);

  return (
    <div className="p-6">
      {/* Title and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
        <h1 className="text-2xl font-bold">{team.name}</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="w-44 flex items-center justify-center gap-2 bg-sky-600 hover:bg-amber-500 text-white px-4 py-2 rounded"
          >
            <HiOutlineUserAdd className="text-lg" />
            Add Members
          </button>

          <button
            onClick={() => setShowEditModal(true)}
            className="w-44 flex items-center justify-center gap-2 bg-green-600 hover:bg-amber-500 text-white px-4 py-2 rounded"
          >
            <FiEdit3 className="text-lg" />
            Edit Team Name
          </button>

          <button
            onClick={openDeleteTeamConfirm}
            className="w-44 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            <MdDeleteOutline className="text-lg" />
            Delete Team
          </button>
        </div>
      </div>

      {team.members.length === 0 ? (
        <p>No members in this team.</p>
      ) : (
        <div className="bg-white p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-100 text-left text-sm font-medium text-gray-700">
                <tr>
                  <th className="px-4 py-2 border-b">Name</th>
                  <th className="px-4 py-2 border-b">Email</th>
                  <th className="px-4 py-2 border-b"></th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {team.members.map((member) => (
                  <tr key={member._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{member.name}</td>
                    <td className="px-4 py-2">{member.email}</td>
                    <td className="px-4 py-2 text-right">
                      <button
                        className="rounded px-4 py-2 bg-red-600 text-white hover:bg-red-700 text-sm"
                        onClick={() =>
                          openRemoveConfirm({
                            id: member._id,
                            name: member.name,
                            email: member.email,
                          })
                        }
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add members modal */}
      {showAddModal && (
        <AddMembersModal
          teamId={id}
          existingMembers={memberIds}
          onClose={() => setShowAddModal(false)}
          onMembersAdded={fetchTeam}
        />
      )}

      {/* Edit name modal */}
      {showEditModal && (
        <EditTeamNameModal
          teamId={id}
          currentName={team.name}
          onClose={() => setShowEditModal(false)}
          onUpdated={fetchTeam}
        />
      )}

      {/* Confirm delete team modal */}
      {confirmDeleteTeamOpen && (
        <ConfirmModal
  title="Delete Team"
  message={
    <>Are you sure you want to delete the team <strong>{team.name}</strong>?</>
  }
  confirmText="Delete"
  cancelText="Cancel"
  danger
  onConfirm={confirmDeleteTeam}
  onClose={() => setConfirmDeleteTeamOpen(false)}
/>

      )}

      {/* Confirm remove member modal */}
      {confirmRemoveOpen && pendingRemove && (
        <ConfirmModal
          title="Remove Member"
          message={
  <>
    Remove <strong>{pendingRemove.name}</strong> ({pendingRemove.email}) from this team?
  </>
}

          confirmText="Remove"
          cancelText="Cancel"
          danger
          onConfirm={confirmRemoveMember}
          onClose={() => setConfirmRemoveOpen(false)}
        />
      )}
    </div>
  );
}
