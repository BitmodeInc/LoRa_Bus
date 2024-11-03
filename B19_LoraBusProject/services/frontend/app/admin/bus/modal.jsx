import React from 'react';

const Modal = ({ isOpen, onClose, onSubmit, newBus, onChange }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md mx-2 sm:mx-auto sm:max-w-md lg:max-w-lg">
        <button
          className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 float-right"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Add Bus
        </h2>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label
              htmlFor="BusStop_name"
              className="block text-gray-700 dark:text-gray-300"
            >
              Bus Name
            </label>
            <input
              type="text"
              id="Bus_name"
              name="Bus_name"
              value={newBus.Bus_name}
              onChange={onChange}
              className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
              placeholder="Enter Bus name"
              required
            />
          </div>
          <div>
            <label
              htmlFor="BusStop_Latitude"
              className="block text-gray-700 dark:text-gray-300"
            >
              Bus Line
            </label>
            <input
              type="text"
              id="Bus_Line"
              name="Bus_Line"
              value={newBus.Bus_Line}
              onChange={onChange}
              className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
              placeholder="Bus Line"
              required
            />
          </div>
          <div>
            <label
              htmlFor="BusStop_Longitude"
              className="block text-gray-700 dark:text-gray-300"
            >
              Dip Switch Value
            </label>
            <input
              type="number"
              id="Dip_Switch_Value"
              name="Dip_Switch_Value"
              value={newBus.Dip_Switch_Value}
              onChange={onChange}
              className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
              placeholder="Enter Dip Switch"
              readOnly
            />
          </div>
          <button className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
            Add Bus
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
