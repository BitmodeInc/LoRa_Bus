// components/ConfirmModal.jsx
import React from 'react';

const ConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-sm mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Warning!!!!</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Are you sure you want to delete this ?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600"
            onClick={onConfirm}
          >
            Yes
          </button>
          <button
            className="bg-gray-300 text-gray-700 rounded px-4 py-2 hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
