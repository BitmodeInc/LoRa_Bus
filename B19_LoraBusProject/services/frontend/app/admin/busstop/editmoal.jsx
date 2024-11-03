import React, { useState, useEffect } from 'react';

export default function EditModal({ isOpen, onClose, busStop, onSubmit }) {
  const [formData, setFormData] = useState({
    BusStop_Name: '',
    BusStop_Latitude: '',
    BusStop_Longitude: '',
    Search_Details: '',
  });

  useEffect(() => {
    if (busStop) {
      setFormData({
        BusStop_Name: busStop.BusStop_Name || '',
        BusStop_Latitude: busStop.BusStop_Latitude || '',
        BusStop_Longitude: busStop.BusStop_Longitude || '',
        Search_Details: busStop.Search_Details || '',
      });
    }
  }, [busStop]);

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
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg mx-auto">
        <button
          className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 float-right"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Edit Bus Stop</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 font-semibold dark:text-gray-300">
              Name:
            </label>
            <input
              type="text"
              name="BusStop_Name"
              value={formData.BusStop_Name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold dark:text-gray-300">
              Latitude:
            </label>
            <input
              type="text"
              name="BusStop_Latitude"
              value={formData.BusStop_Latitude}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold dark:text-gray-300">
              Longitude:
            </label>
            <input
              type="text"
              name="BusStop_Longitude"
              value={formData.BusStop_Longitude}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold dark:text-gray-300">
              Details:
            </label>
            <input
              type="text"
              name="Search_Details"
              value={formData.Search_Details}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
