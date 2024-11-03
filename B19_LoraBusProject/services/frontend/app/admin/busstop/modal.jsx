import React from 'react';

const Modal = ({ isOpen, onClose, onSubmit, newBusStop, onChange }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
        <button className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 float-right" onClick={onClose}>
          ✕
        </button>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Add Bus Stop</h2>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label htmlFor="BusStop_name" className="block text-gray-700 dark:text-gray-300">Bus Stop Name</label>
            <input
              type="text"
              id="BusStop_name"
              name="BusStop_name"
              value={newBusStop.BusStop_name}
              onChange={onChange}
              className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
              placeholder="Enter bus stop name"
              required
            />
          </div>
          <div>
            <label htmlFor="BusStop_Latitude" className="block text-gray-700 dark:text-gray-300">Latitude</label>
            <input
              type="text"
              id="BusStop_Latitude"
              name="BusStop_Latitude"
              value={newBusStop.BusStop_Latitude}
              onChange={onChange}
              className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
              placeholder="Enter latitude"
              required
            />
          </div>
          <div>
            <label htmlFor="BusStop_Longitude" className="block text-gray-700 dark:text-gray-300">Longitude</label>
            <input
              type="text"
              id="BusStop_Longitude"
              name="BusStop_Longitude"
              value={newBusStop.BusStop_Longitude}
              onChange={onChange}
              className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
              placeholder="Enter longitude"
              required
            />
          </div>
          <div>
            <label htmlFor="Search_Details" className="block text-gray-700 dark:text-gray-300">Search Details</label>
            <input
              type="text"
              id="Search_Details"
              name="Search_Details"
              value={newBusStop.Search_Details}
              onChange={onChange}
              className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
              placeholder="Enter search details (optional)"
            />
          </div>
          <button className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
            Add Bus Stop
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
