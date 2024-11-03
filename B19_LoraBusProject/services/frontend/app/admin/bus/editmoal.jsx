import React, { useState, useEffect } from 'react';

export default function EditModal({ isOpen, onClose, bus, onSubmit }) {
  const [formData, setFormData] = useState({
    Bus_Name: '',
    Bus_Line: '',
    Dip_Switch_Value: '',
  });

  useEffect(() => {
    if (bus) {
      setFormData({
        Bus_name: bus.Bus_Name || '',
        Bus_Line: bus.Bus_Line || '',
        Dip_Switch_Value: bus.Dip_Switch_Value || '',
      });
    }
  }, [bus]);

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
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg mx-2 sm:mx-auto sm:max-w-md lg:max-w-lg">
        <button
          className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 float-right"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Edit Bus </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 font-semibold dark:text-gray-300">
              Bus Name:
            </label>
            <input
              type="text"
              name="Bus_name"
              value={formData.Bus_name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold dark:text-gray-300">
              Bus Line:
            </label>
            <input
              type="number"
              name="Bus_Line"
              value={formData.Bus_Line}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold dark:text-gray-300">
              Dip Switch:
            </label>
            <input
              type="text"
              name="Dip_Switch_Value"
              value={formData.Dip_Switch_Value}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              readOnly
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
