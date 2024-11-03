'use client';
import React, { useState, useEffect } from 'react';
import Modal from './modal.jsx'; // Import the Modal component
import EditModal from './editmoal.jsx'; // Import the EditModal component
import ConfirmModal from './confirmmodal.jsx'; // Import the ConfirmModal component
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faSignHanging} from "@fortawesome/free-solid-svg-icons";

export default function BusStopPage() {
  const router = useRouter();
  const [busStops, setBusStops] = useState([]);
  const [newBusStop, setNewBusStop] = useState({
    BusStop_name: '',
    BusStop_Latitude: '',
    BusStop_Longitude: '',
    Search_Details: '',
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedBusStop, setSelectedBusStop] = useState(null);
  const [error, setError] = useState(null);

  // Fetch data from the Express API
  useEffect(() => {
    const adminId = document.cookie.split('; ').find(row => row.startsWith('Admin_ID='));
    if (!adminId) {
      window.location.href = '/login'
      alert("คุณไม่มีสิทธิ์ในการเข้าใช้หน้านี้")
      return;
    }
    const fetchData = async () => {
      try {
        const res = await fetch('https://service.lora-bus.com/web_api/getBusStop');
        const data = await res.json();
        setBusStops(data.data || []);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };

    fetchData();
  }, [router]);

  // Handle form input changes for new bus stop
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBusStop({ ...newBusStop, [name]: value });
  };

  // Handle form submission for adding new bus stop
  const handleSubmit = async (e) => {
    e.preventDefault();
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    };
    const id = getCookie('Admin_ID');
    try {
      const res = await fetch('https://service.lora-bus.com/admin_api/addbusstop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Admin_ID: id, ...newBusStop }),
      });
      const data = await res.json();
      if (data.success) {
        setBusStops([...busStops, newBusStop]);
        setNewBusStop({
          BusStop_name: '',
          BusStop_Latitude: '',
          BusStop_Longitude: '',
          Search_Details: '',
        });
        setModalOpen(false);
        setError(null);
        window.location.reload();
      } else {
        setError(data.msg || 'Failed to add bus stop');
      }
    } catch (err) {
      setError('An error occurred while adding the bus stop');
    }
  };

  // Handle form submission for editing bus stop
  const handleEdit = async (formData) => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    };
    const id = getCookie('Admin_ID');
    if (!selectedBusStop) return;

    try {
      const res = await fetch(`https://service.lora-bus.com/admin_api/editBusStop/${selectedBusStop.BusStop_ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Admin_ID: id, ...formData }),
      });
      const data = await res.json();
      if (data.success) {
        setBusStops(busStops.map(busStop =>
          busStop.BusStop_ID === selectedBusStop.BusStop_ID ? { ...busStop, ...formData } : busStop
        ));
        setEditModalOpen(false);
        window.location.reload();
        setError(null);
      } else {
        setError(data.msg || 'Failed to update bus stop');
      }
    } catch (err) {
      setError('An error occurred while updating the bus stop');
    }
  };

  // Handle opening the edit modal
  const handleEditClick = (busStop) => {
    setSelectedBusStop(busStop);
    setEditModalOpen(true);
  };

  // Handle opening the confirm modal
  const handleDeleteClick = (busStop) => {
    setSelectedBusStop(busStop);
    setConfirmModalOpen(true);
  };

  // Handle deleting a bus stop
  const handleDelete = async () => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    };
    const id = getCookie('Admin_ID');
    if (!selectedBusStop) return;

    try {
      const res = await fetch(`https://service.lora-bus.com/admin_api/deleteBusStop/${selectedBusStop.BusStop_ID}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Admin_ID: id }),
      });
      const data = await res.json();
      if (data.success) {
        setBusStops(busStops.filter(busStop => busStop.BusStop_ID !== selectedBusStop.BusStop_ID));
        setError(null);
      } else {
        setError(data.msg || 'Failed to delete bus stop');
      }
    } catch (err) {
      setError('An error occurred while deleting the bus stop');
    } finally {
      setConfirmModalOpen(false);
      setSelectedBusStop(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      <div className="container mx-auto p-5">
        <FontAwesomeIcon icon={faSignHanging} className="text-6xl mr-5" />
        <h1 className="text-4xl font-bold mb-5">Bus Stops Management</h1>
        {error && <p className="text-red-500">{error}</p>}
        <div className="mb-5">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => setModalOpen(true)}
          >
            Add Bus Stop
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b dark:border-gray-700 text-left">ID</th>
                <th className="py-2 px-4 border-b dark:border-gray-700 text-left">Name</th>
                <th className="py-2 px-4 border-b dark:border-gray-700 text-left">Latitude</th>
                <th className="py-2 px-4 border-b dark:border-gray-700 text-left">Longitude</th>
                <th className="py-2 px-4 border-b dark:border-gray-700 text-left">Details</th>
                <th className="py-2 px-4 border-b dark:border-gray-700 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {busStops.map((busStop, index) => (
                <tr key={index} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td className="py-2 px-4 border-b dark:border-gray-700">{busStop.BusStop_ID}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-700">{busStop.BusStop_Name}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-700">{busStop.BusStop_Latitude}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-700">{busStop.BusStop_Longitude}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-700">{busStop.Search_Details}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-700">
                    <button
                      className="mr-2 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      onClick={() => handleEditClick(busStop)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => handleDeleteClick(busStop)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        newBusStop={newBusStop}
        onChange={handleInputChange}
        />
      )}
      {editModalOpen && selectedBusStop && (
        <EditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        busStop={selectedBusStop}
        onSubmit={handleEdit}
        />
      )}
      {confirmModalOpen && (
        <ConfirmModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
