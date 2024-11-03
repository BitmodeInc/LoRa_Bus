import React from 'react';

const Modal = ({ isOpen, onClose, onSubmit, newLoRaDevice, onChange }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
        <button
          className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 float-right"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Add LoRa Device</h2>
        <form className="space-y-4" onSubmit={onSubmit}>
          <input
            type="text"
            name="Dip_Switch_Value"
            value={newLoRaDevice?.Dip_Switch_Value || ''} // Handle undefined
            onChange={onChange}
            placeholder="Dip Switch"
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <input
            type="text"
            name="Bus_ID"
            value={newLoRaDevice?.Bus_ID || ''} // Handle undefined
            onChange={onChange}
            placeholder="Bus ID"
            
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <input
            type="text"
            name="Transmission_Interval"
            value={newLoRaDevice?.Transmission_Interval || ''} // Handle undefined
            onChange={onChange}
            placeholder="Transmission Interval"
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <select
            name="Status"
            value={newLoRaDevice?.Status || ''} // Handle undefined
            onChange={onChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">Select Status</option>
            <option value="0">0 (Inactive)</option>
            <option value="1">1 (Active)</option>
          </select>
          <button className="w-full bg-blue-500 text-white rounded hover:bg-blue-600 py-2" type="submit">
            Add LoRa Device
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
