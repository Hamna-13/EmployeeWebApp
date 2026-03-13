import React from 'react';
import { HiOutlineUserAdd } from 'react-icons/hi';

export default function AddEmployeeButton({ onClick }) {
  return (
    <button
      className="w-44 flex items-center justify-center gap-2 bg-sky-600 text-white px-4 py-2 rounded hover:bg-amber-500"
      onClick={onClick}
    >
      <HiOutlineUserAdd className="text-lg" />
      Add Employee
    </button>
  );
}
