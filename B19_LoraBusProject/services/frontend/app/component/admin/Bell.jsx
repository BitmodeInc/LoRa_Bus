'use client';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faTrash } from '@fortawesome/free-solid-svg-icons';

const NotificationButton = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showPopup, setShowPopup] = useState(false); // State สำหรับป๊อปอัป
    const [popupMessage, setPopupMessage] = useState(""); // ข้อความในป๊อปอัป

    const fetchNotifications = async () => {
        try {
            const response = await fetch("https://service.lora-bus.com/admin_api/getLoRaLast");
            if (!response.ok) {
                throw new Error("Failed to fetch notifications");
            }
            const data = await response.json();

            if (data.success && Array.isArray(data.data)) {
                const shouldNotify = data.data.some((entry) => entry.LoRa_Battery < 20 || entry.LoRa_Temp >= 80);
                if (shouldNotify) {
                    await sendNotification(data.data);
                }
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const sendNotification = async (data) => {
        try {
            const response = await fetch("https://service.lora-bus.com/admin_api/notification", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Failed to send notification");
            }

            const result = await response.json();
            if (!result.success) {
                console.error("Notification API responded with an error:", result);
            }
        } catch (error) {
            console.error("Error sending notification:", error);
        }
    };

    const fetchNotificationsData = async () => {
        try {
            const response = await fetch("https://service.lora-bus.com/admin_api/notification");
            if (!response.ok) {
                throw new Error("Failed to fetch notifications data");
            }
            const data = await response.json();

            if (data.success) {
                setNotifications(data.data);
                console.log("Fetched notifications data:", data.data);

                // ตั้งค่าข้อความในป๊อปอัปและแสดงมัน
                if (data.data.length > 0) {
                    setPopupMessage("You have new notifications!");
                    setShowPopup(true);
                    setTimeout(() => {
                        setShowPopup(false); // ปิดป๊อปอัปหลังจาก 3 วินาที
                    }, 3000);
                }
            } else {
                console.error("Error in response:", data.message);
            }
        } catch (error) {
            console.error("Error fetching notifications data:", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        fetchNotificationsData();

        const interval = setInterval(() => {
            fetchNotifications();
            fetchNotificationsData();
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const handleToggle = () => {
        setShowNotifications(!showNotifications);
    };

    const handleRemoveNotification = async (index) => {
        const notificationToRemove = notifications[index];
        console.log("Removing notification data:", {
            dipSwitchValue: notificationToRemove.Dip_Switch_Value,
            issueType: notificationToRemove.Issue_Type,
        });
        try {
            const response = await fetch(`https://service.lora-bus.com/admin_api/notification`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    dipSwitchValue: String(notificationToRemove.Dip_Switch_Value),
                    issueType: notificationToRemove.Issue_Type,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to delete notification");
            }

            setNotifications(notifications.filter((_, i) => i !== index));
        } catch (error) {
            console.error("Error removing notification:", error);
        }
    };

    const handleClearAll = async () => {
        try {
            const response = await fetch("https://service.lora-bus.com/admin_api/notification/deleteall/all", {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error("Failed to clear all notifications");
            }

            setNotifications([]);
        } catch (error) {
            console.error("Error clearing all notifications:", error);
        }
    };

    return (
        <div className="fixed top-4 right-28 z-50">
            <button
                onClick={handleToggle}
                className="text-2xl text-black dark:text-white p-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
            >
                <FontAwesomeIcon icon={faBell} />
                {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                        {notifications.length}
                    </span>
                )}
            </button>

            {showNotifications && (
                <div className="absolute right-0 mt-2 w-64 max-h-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 overflow-y-auto">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-black dark:text-white">Notifications</h4>
                        {notifications.length > 0 && (
                            <button
                                onClick={handleClearAll}
                                className="text-red-500 hover:text-red-700 text-sm"
                            >
                                Clear All
                            </button>
                        )}
                    </div>
                    <ul className="text-black dark:text-white">
                        {notifications.length > 0 ? (
                            notifications.map((notification, index) => (
                                <li key={index} className="py-2 border-b border-gray-300 dark:border-gray-700 flex justify-between rounded-lg bg-gray-100 dark:bg-gray-900 my-1">
                                    <span>
                                        <div>
                                            LoRa Device {notification.Dip_Switch_Value}:{" "}<br />
                                            {notification.Issue_Type} 
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {new Date(notification.Latest_Event_Time).toLocaleString('th-TH', {
                                                dateStyle: 'short',
                                                timeStyle: 'short',
                                            })}
                                        </div>
                                    </span>
                                    <button
                                        onClick={() => handleRemoveNotification(index)}
                                        className="ml-2 text-red-500 hover:text-red-700"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </li>
                            ))
                        ) : (
                            <li className="py-2">No Notifications</li>
                        )}
                    </ul>
                </div>
            )}

            {/* ป๊อปอัปสำหรับแจ้งเตือน */}
            {showPopup && (
                <div className="fixed bottom-4 right-4 bg-red-500 text-white p-3 rounded-lg shadow-lg">
                    {popupMessage}
                </div>
            )}
        </div>
    );
};

export default NotificationButton;
