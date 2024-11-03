import React, { useState, useEffect } from 'react';

export default function EditModal({ isOpen, onClose, loraDevice, onSubmit }) {
  const [formData, setFormData] = useState({
    Dip_Switch_Value: '',
    Bus_ID: '',
    Transmission_Interval: '',
    Status: '',
  });

  useEffect(() => {
    if (loraDevice) {
      setFormData({
        Dip_Switch_Value: loraDevice.Dip_Switch_Value || '',
        Bus_ID: loraDevice.Bus_ID || '',
        Transmission_Interval: loraDevice.Transmission_Interval || '',
        Status: loraDevice.Status || '',
      });
    }
  }, [loraDevice]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

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
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Edit LoRa Device</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-gray-700 dark:text-gray-300">Dip Switch Value:</span>
            <input
              type="text"
              name="Dip_Switch_Value"
              value={formData.Dip_Switch_Value}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              readOnly
            />
          </label>
          <label className="block">
            <span className="text-gray-700 dark:text-gray-300">Bus ID:</span>
            <input
              type="text"
              name="Bus_ID"
              value={formData.Bus_ID}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              
            />
          </label>
          <label className="block">
            <span className="text-gray-700 dark:text-gray-300">Transmission Interval:</span>
            <input
              type="text"
              name="Transmission_Interval"
              value={formData.Transmission_Interval}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </label>
          <label className="block">
            <span className="text-gray-700 dark:text-gray-300">Status:</span>
            <select
              name="Status"
              value={formData.Status}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            >
              <option value="">Select Status</option>
              <option value="0">0 (Inactive)</option>
              <option value="1">1 (Active)</option>
            </select>
          </label>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white rounded hover:bg-blue-600 py-2"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
