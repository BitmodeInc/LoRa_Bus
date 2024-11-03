"use client";
import React, { useState, useEffect } from 'react';
import Modal from './modal';
import EditModal from './editmoal';
import ConfirmModal from './confirmmodal';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBus,
  faSignHanging,
  faTriangleExclamation,
  faTowerBroadcast,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

export default function BusPage() {
  const router = useRouter();
  const [buses, setBuses] = useState([]);
  const [newBus, setNewBus] = useState({
    Bus_name: '',
    Bus_Line: '',
    Dip_Switch_Value: '',
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const adminId = document.cookie.split('; ').find(row => row.startsWith('Admin_ID='));
    if (!adminId) {
      window.location.href = '/login'
      return;
    }
    const fetchData = async () => {
      try {
        const res = await fetch('https://service.lora-bus.com/admin_api/getBus');
        if (!res.ok) throw new Error('Failed to fetch buses');

        const data = await res.json();
        if (data.success) {
          setBuses(data.data || []);
        } else {
          setError(data.msg || 'Error loading buses');
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('เกิดข้อผิดพลาดในการดึงข้อมูล');
      }
    };

    fetchData();
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBus({ ...newBus, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    };
    const id = getCookie('Admin_ID');
    try {
      const res = await fetch('https://service.lora-bus.com/admin_api/addbus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Admin_ID: id, ...newBus }),
      });
      const data = await res.json();
      if (data.success) {
        setBuses([...buses, newBus]);
        setNewBus({
          Bus_name: '',
          Bus_Line: '',
          Dip_Switch_Value: '',
        });
        setModalOpen(false);
        setError(null);
        window.location.reload();
      } else {
        setError(data.msg || 'Failed to add bus');
      }
    } catch (err) {
      setError('An error occurred while adding the bus');
    }
  };

  const handleEdit = async (formData) => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    };
    if (!selectedBus) return;
    const id = getCookie('Admin_ID');
    try {
      const res = await fetch(`https://service.lora-bus.com/admin_api/editBus/${selectedBus.Bus_ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Admin_ID: id, ...formData }),
      });
      const data = await res.json();
      if (data.success) {
        setBuses(buses.map(bus =>
          bus.Bus_ID === selectedBus.Bus_ID ? { ...bus, ...formData } : bus
        ));
        setEditModalOpen(false);
        setError(null);
        window.location.reload();
      } else {
        setError(data.msg || 'Failed to update bus');
      }
    } catch (err) {
      setError('An error occurred while updating the bus');
    }
  };

  const handleEditClick = (bus) => {
    setSelectedBus(bus);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (bus) => {
    setSelectedBus(bus);
    setConfirmModalOpen(true);
  };

  const handleDelete = async () => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    };
    const id = getCookie('Admin_ID');
    if (!selectedBus) return;

    try {
      const res = await fetch(`https://service.lora-bus.com/admin_api/deleteBus/${selectedBus.Bus_ID}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Admin_ID: id }),
      });
      const data = await res.json();
      if (data.success) {
        setBuses(buses.filter(bus => bus.Bus_ID !== selectedBus.Bus_ID));
        setError(null);
      } else {
        setError(data.msg || 'Failed to delete bus');
      }
    } catch (err) {
      setError('An error occurred while deleting the bus');
    } finally {
      setConfirmModalOpen(false);
      setSelectedBus(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      <div className="container mx-auto p-5">
        <div className="flex items-center mb-5">
          <FontAwesomeIcon icon={faBus} className="text-6xl mr-5" />
          <h1 className="text-4xl font-bold">Bus Management</h1>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => setModalOpen(true)}
        >
          Add Bus
        </button>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="py-2 px-4 border-b dark:border-gray-700">Bus ID</th>
                <th className="py-2 px-4 border-b dark:border-gray-700">Bus Name</th>
                <th className="py-2 px-4 border-b dark:border-gray-700">Bus Line</th>
                <th className="py-2 px-4 border-b dark:border-gray-700">Dip Switch</th>
                <th className="py-2 px-4 border-b dark:border-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {buses.map((bus, index) => (
                <tr key={index} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td className="py-2 px-4 border-b dark:border-gray-700 text-center">{bus.Bus_ID}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-700 text-center">{bus.Bus_Name}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-700 text-center">{bus.Bus_Line}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-700 text-center">{bus.Dip_Switch_Value}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-700">
                    <button
                      className="mr-2 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      onClick={() => handleEditClick(bus)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => handleDeleteClick(bus)}
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

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        newBus={newBus}
        onChange={handleInputChange}
      />
      {selectedBus && (
        <EditModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          bus={selectedBus}
          onSubmit={handleEdit}
        />
      )}
      <ConfirmModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
