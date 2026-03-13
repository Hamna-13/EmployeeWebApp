import React from "react";

export default function ConfirmModal({
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onClose,
  danger = false,
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative">
        {/* Header */}
        <div className="bg-sky-600 text-white px-6 py-3 rounded-t-lg flex justify-between items-center">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            className="text-white text-2xl leading-none"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-center">
          <p className="text-gray-700 text-base">{message}</p>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-center gap-4 px-6 pb-6">
          <button
            onClick={onClose}
            className="w-28 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`w-28 px-4 py-2 rounded font-medium text-white ${
              danger
                ? "bg-red-600 hover:bg-red-700"
                : "bg-sky-600 hover:bg-amber-500"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
