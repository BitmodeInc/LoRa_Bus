"use client";
import React, { useEffect, useState } from 'react';

const BottomLeftBox = () => {
    const [imageSet, setImageSet] = useState('light');

    // รูปภาพสำหรับธีมสว่างและธีมมืด
    const images = {
        light: {
            bus: '/images/BusPin.png',
            busStop: '/images/Bus stop.png',
            busStation: '/images/BusStation.PNG',
            youHere: '/images/person.png',
        },
        dark: {
            bus: '/images/BusPinDark.png',
            busStop: '/images/BusStopDark.png',
            busStation: '/images/BusStationDark.PNG',
            youHere: '/images/personDark.png',
        }
    };

    return (
        <div
            className="absolute bottom-5 left-5 z-50 bg-gray-800 text-white rounded-lg shadow-md p-4 flex items-center justify-between space-x-6"
            style={{ maxWidth: '90%', padding: '10px 20px' }} // เพิ่มการควบคุมขนาดและ padding
        >
            {/* Bus */}
            <div className="flex items-center space-x-2">
                <img src={images.light.bus} alt="Bus" className="w-8 h-8" />
                <p className="text-lg">Bus</p>
            </div>
            
            {/* Bus Stop */}
            <div className="flex items-center space-x-2">
                <img src={images.light.busStop} alt="Bus Stop" className="w-8 h-8" />
                <p className="text-lg">Bus Stop</p>
            </div>
            
            {/* Bus Station */}
            <div className="flex items-center space-x-2">
                <img src={images.light.busStation} alt="Bus Station" className="w-8 h-8" />
                <p className="text-lg">Bus Station</p>
            </div>
            
            {/* You Here */}
            <div className="flex items-center space-x-2">
                <img src={images.light.youHere} alt="You Here" className="w-8 h-8" />
                <p className="text-lg">You Here</p>
            </div>
        </div>
    );
};

export default BottomLeftBox;
