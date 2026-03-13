import React, { useState } from "react";
import Swal from "sweetalert2";

export default function EditTeamNameModal({
  teamId,
  currentName = "",
  onClose,
  onUpdated
}) {
  const [name, setName] = useState(currentName);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      await Swal.fire({
        icon: "info",
        title: "Invalid name",
        text: "Team name cannot be empty",
        buttonsStyling: false,
        customClass: {
          confirmButton: "bg-sky-600 hover:bg-amber-500 text-white px-6 py-2 rounded font-medium"
        }
      });
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/teams/${teamId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name })
      });
      const data = await res.json();

      if (!res.ok) {
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "Failed to update team name",
          buttonsStyling: false,
          customClass: {
            confirmButton: "bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-medium"
          }
        });
        setSaving(false);
        return;
      }

      await Swal.fire({
        icon: "success",
        title: "Team updated",
        html: `Team name changed to <strong>${name}</strong>`,
        buttonsStyling: false,
        customClass: {
          confirmButton: "bg-sky-600 hover:bg-amber-500 text-white px-8 py-2 rounded font-medium"
        },
        confirmButtonText: "OK"
      });

      onUpdated?.();
      onClose();
    } catch {
      await Swal.fire({
        icon: "error",
        title: "Server error",
        text: "Could not update team name",
        buttonsStyling: false,
        customClass: {
          confirmButton: "bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-medium"
        }
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative">
        {/* Header */}
        <div className="bg-sky-600 text-white px-6 py-3 rounded-t-lg flex justify-between items-center">
          <h2 className="text-lg font-semibold">Edit Team Name</h2>
          <button className="text-white text-2xl leading-none" onClick={onClose}>
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter team name"
            />

            <div className="mt-6 flex justify-center gap-4">
              <button
                type="button"
                onClick={onClose}
                className="w-28 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded font-medium"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-28 bg-sky-600 hover:bg-amber-500 text-white px-4 py-2 rounded font-medium disabled:opacity-60"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
