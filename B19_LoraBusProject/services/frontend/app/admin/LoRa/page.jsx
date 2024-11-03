"use client";
import React, { useState, useEffect } from 'react';
import Modal from './modal'; // Import the Modal component
import EditModal from './editmoal'; // Import the EditModal component
import ConfirmModal from './confirmmodal'; // Import the ConfirmModal component

export default function LoRaDevicePage() {
  const [loraDevices, setLoRaDevices] = useState([]);
  const [newLoRaDevice, setNewLoRaDevice] = useState({
    Dip_Switch_Value: '',
    Bus_ID: '',
    Transmission_Interval: '',
    Status: '',
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedLoRaDevice, setSelectedLoRaDevice] = useState(null);
  const [error, setError] = useState(null);

  // Fetch data from the Express API
  useEffect(() => {
    // ตรวจสอบ Admin_ID ในคุกกี้
    const adminId = document.cookie.split('; ').find(row => row.startsWith('Admin_ID='));
    if (!adminId) {
      window.location.href = '/login'
      alert("คุณไม่มีสิทธิ์ในการเข้าใช้หน้านี้");
      return;
    }
    const fetchData = async () => {
      try {
        const res = await fetch('https://service.lora-bus.com/admin_api/getLoRa');
        const data = await res.json();
        setLoRaDevices(data.data || []);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };

    fetchData();
  }, []);

  // Handle form input changes for new LoRa device
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLoRaDevice({ ...newLoRaDevice, [name]: value });
  };

  // Handle form submission for adding new LoRa device
  const handleSubmit = async (e) => {
    e.preventDefault();
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`); 
      if (parts.length === 2) return parts.pop().split(';').shift();
    };
    const id = getCookie('Admin_ID');
    try {
      const res = await fetch('https://service.lora-bus.com/admin_api/addLoRa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Admin_ID: id, ...newLoRaDevice }),
      });
      const data = await res.json();
      if (data.success) {
        setLoRaDevices([...loraDevices, newLoRaDevice]);
        setNewLoRaDevice({
          Dip_Switch_Value: '',
          Bus_ID: '',
          Transmission_Interval: '',
          Status: '',
        });
        setModalOpen(false);
        window.location.reload();
        setError(null);
        
      } else {
        setError(data.msg || 'Failed to add LoRa device');
      }
    } catch (err) {
      setError('An error occurred while adding the LoRa device');
    }
  };

  // Handle form submission for editing LoRa device
  const handleEdit = async (formData) => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`); 
      if (parts.length === 2) return parts.pop().split(';').shift();
    };
    const id = getCookie('Admin_ID');
    if (!selectedLoRaDevice) return;

    try {
      const res = await fetch(`https://service.lora-bus.com/admin_api/editLoRa/${selectedLoRaDevice.Dip_Switch_Value}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Admin_ID: id, ...formData }),
      });
      const data = await res.json();
      if (data.success) {
        setLoRaDevices(loraDevices.map(lora =>
          lora.Dip_Switch_Value === selectedLoRaDevice.Dip_Switch_Value ? { ...lora, ...formData } : lora
        ));
        setEditModalOpen(false);
        
         window.location.reload();
        
        setError(null);
      } else {
        setError(data.msg || 'Failed to update LoRa device');
      }
    } catch (err) {
      setError('An error occurred while updating the LoRa device');
    }
  };

  // Handle opening the edit modal
  const handleEditClick = (loraDevice) => {
    setSelectedLoRaDevice(loraDevice);
    setEditModalOpen(true);
  };

  // Handle opening the confirm modal
  const handleDeleteClick = (loraDevice) => {
    setSelectedLoRaDevice(loraDevice);
    setConfirmModalOpen(true);
  };

  // Handle deleting a LoRa device
  const handleDelete = async () => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`); 
      if (parts.length === 2) return parts.pop().split(';').shift();
    };
    const id = getCookie('Admin_ID');
    if (!selectedLoRaDevice) return;

    try {
      const res = await fetch(`https://service.lora-bus.com/admin_api/deleteLoRa/${selectedLoRaDevice.Dip_Switch_Value}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Admin_ID: id
        }),
      });
      const data = await res.json();
      if (data.success) {
        setLoRaDevices(loraDevices.filter(lora => lora.Dip_Switch_Value !== selectedLoRaDevice.Dip_Switch_Value));
        setError(null);
      } else {
        setError(data.msg || 'Failed to delete LoRa device');
      }
    } catch (err) {
      setError('An error occurred while deleting the LoRa device');
    } finally {
      setConfirmModalOpen(false);
      setSelectedLoRaDevice(null);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex flex-col sm:flex-row items-center space-x-4 mb-6">
        {/* <img className="w-16 h-16" src="../images/LoRa Device.png" alt="LoRa Device Icon" /> */}
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">LoRa Devices</h1>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-6">
        <button className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => setModalOpen(true)}>
          Add LoRa Device
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-700 border border-gray-200">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-600">
              <th className="py-2 px-4 text-left text-black dark:text-white">Dip Switch Value</th>
              <th className="py-2 px-4 text-left text-black dark:text-white">Bus ID</th>
              <th className="py-2 px-4 text-left text-black dark:text-white">Transmission Interval</th>
              <th className="py-2 px-4 text-left text-black dark:text-white">Status</th>
              <th className="py-2 px-4 text-left text-black dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loraDevices.map((lora, index) => (
              <tr key={index} className="border-t hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="py-2 px-4">{lora.Dip_Switch_Value}</td>
                <td className="py-2 px-4">{lora.Bus_ID}</td>
                <td className="py-2 px-4">{lora.Transmission_Interval}</td>
                <td className="py-2 px-4">{lora.Status ? 'Active' : 'Inactive'}</td>
                <td className="py-2 px-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <button className="w-full sm:w-auto bg-green-500 text-white rounded hover:bg-green-600" onClick={() => handleEditClick(lora)}>Edit</button>
                  <button className="w-full sm:w-auto bg-red-500 text-white rounded hover:bg-red-600" onClick={() => handleDeleteClick(lora)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for adding LoRa device */}
      {modalOpen && (
        <Modal isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        newLoRaDevice={newLoRaDevice}
        onChange={handleInputChange}/>
          
        
      )}

      {/* Modal for editing LoRa device */}
      {editModalOpen && selectedLoRaDevice && (
        <EditModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          loraDevice={selectedLoRaDevice}
          onSubmit={handleEdit}
        />
      )}

      {/* Confirm Modal for deleting LoRa device */}
      {confirmModalOpen && (
        <ConfirmModal
          isOpen={confirmModalOpen}
          onClose={() => setConfirmModalOpen(false)}
          onConfirm={handleDelete}
          // itemName={selectedLoRaDevice?.Dip_Switch_Value}
        />
      )}
    </div>
  );
}
