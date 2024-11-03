'use client';

import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LoRaDashboard = () => {
  const [loRaLog, setLoRaLog] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const fetchInterval = 500;

  const fetchLoRaLog = async () => {
    try {
      const response = await fetch('https://service.lora-bus.com/admin_api/getLoRaLast');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      const latestData = data.data.reduce((acc, curr) => {
        if (!acc[curr.Dip_Switch_Value] || new Date(curr.Update_Time) > new Date(acc[curr.Dip_Switch_Value].Update_Time)) {
          acc[curr.Dip_Switch_Value] = curr;
        }
        return acc;
      }, {});

      const latestDevices = Object.values(latestData);
      setLoRaLog(latestDevices);

      if (selectedDevice && !latestDevices.find(device => device.Dip_Switch_Value === selectedDevice.Dip_Switch_Value)) {
        setSelectedDevice(latestDevices[0] || null);
      }
    } catch (error) {
      console.error('Error fetching LoRa log:', error);
    }
  };

  useEffect(() => {
    fetchLoRaLog();
    const intervalId = setInterval(fetchLoRaLog, fetchInterval);
    return () => clearInterval(intervalId);
  }, []);

  const handleSelectDevice = (device) => {
    setSelectedDevice(device);
  };

  const rssiData = {
    labels: loRaLog.map((device) => new Date(device.Update_Time).toLocaleTimeString()),
    datasets: [
      {
        label: 'RSSI (dBm)',
        data: loRaLog.map((device) => device.LoRa_RSSI),
        borderColor: 'blue',
        backgroundColor: 'lightblue',
      },
    ],
  };

  const snrData = {
    labels: loRaLog.map((device) => new Date(device.Update_Time).toLocaleTimeString()),
    datasets: [
      {
        label: 'SNR',
        data: loRaLog.map((device) => device.LoRa_SNR),
        borderColor: 'green',
        backgroundColor: 'lightgreen',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black dark:bg-gray-900 dark:text-white">
      <div className="container mx-auto p-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Sidebar สำหรับรายการอุปกรณ์ */}
          <div className="col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-4">LoRa Devices</h3>
            <ul className="space-y-2">
              {loRaLog.map((device) => (
                <li
                  key={device.Dip_Switch_Value}
                  className={`p-3 rounded-md cursor-pointer transition-all duration-150 hover:bg-blue-500 hover:text-white ${
                    selectedDevice?.Dip_Switch_Value === device.Dip_Switch_Value ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                  onClick={() => handleSelectDevice(device)}
                >
                  <div className="flex justify-between">
                    <p>LoRa {device.Dip_Switch_Value}</p>
                    {device.LoRa_Battery < 20 && (
                      <img src="/images/warning-icon.png" alt="Warning" className="w-8 h-8" />
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Detail Dashboard */}
          <div className="col-span-1 md:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            {selectedDevice ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Battery */}
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
                  <h4 className="text-lg font-semibold mb-2">Battery</h4>
                  <div className="w-full bg-gray-300 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full transition-all duration-150 ${
                        selectedDevice.LoRa_Battery <= 15
                          ? 'bg-red-500'
                          : selectedDevice.LoRa_Battery <= 40
                          ? 'bg-orange-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${selectedDevice.LoRa_Battery}%` }}
                    ></div>
                  </div>
                  <p>{selectedDevice.LoRa_Battery}%</p>
                </div>

                {/* Temperature */}
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
                  <h4 className="text-lg font-semibold mb-2">Temperature</h4>
                  <div className="w-full bg-gray-300 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full transition-all duration-150 ${
                        selectedDevice.LoRa_Temp <= 30
                          ? 'bg-green-500'
                          : selectedDevice.LoRa_Temp <= 79
                          ? 'bg-orange-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${(selectedDevice.LoRa_Temp + 50) / 100 * 100}%` }}
                    ></div>
                  </div>
                  <p>{selectedDevice.LoRa_Temp}°C</p>
                </div>

                {/* RSSI Chart */}
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
                  <h4 className="text-lg font-semibold">RSSI</h4>
                  <Line data={rssiData} options={chartOptions} />
                </div>

                {/* SNR Chart */}
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
                  <h4 className="text-lg font-semibold">SNR</h4>
                  <Line data={snrData} options={chartOptions} />
                </div>

                {/* Location */}
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
                  <h4 className="text-lg font-semibold">Location</h4>
                  <p>Latitude: {selectedDevice.LoRa_Latitude}</p>
                  <p>Longitude: {selectedDevice.LoRa_Longitude}</p>
                </div>

                {/* Update Time */}
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
                  <h4 className="text-lg font-semibold">Update Time</h4>
                  <p>{new Date(selectedDevice.Update_Time).toLocaleString()}</p>
                </div>
              </div>
            ) : (
              <p>Please select a LoRa Device</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoRaDashboard;
