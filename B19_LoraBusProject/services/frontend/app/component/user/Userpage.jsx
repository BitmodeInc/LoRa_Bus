'use client'
import React from "react";
import Map from "./component/user/Map";
import SearchBox from "./component/user/Searchbox";
//import BottomLeftBox from "./BottomLeftBox";
import { useEffect, useState } from 'react';
export default function AdminPage({}) {
    const [searchResults, setSearchResults] = useState({
        buses: [],
        busStops: [],
      });
    
      // ตัวแปรสำหรับเก็บผลลัพธ์การค้นหา
      const [storedResults, setStoredResults] = useState({
        buses: [],
        busStops: [],
      });
    
      const [searchType, setSearchType] = useState(''); 
    
      
    
      const handleSearch = async (searchTerm, type) => {
        if (!searchTerm.trim()) {
          alert('Please enter a search term.');
          return;
        }
    
        setSearchType(type); // ตั้งค่าประเภทการค้นหา
    
        try {
          let response;
          // เลือก API ตามประเภทการค้นหา
          if (type === 'bus') {
            response = await fetch(`https://service.lora-bus.com/web_api/search/bus?bus_name=${encodeURIComponent(searchTerm)}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
            });
          } else {
            response = await fetch(`https://service.lora-bus.com/web_api/search/busstop?busstop_name=${encodeURIComponent(searchTerm)}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
            });
          }
    
          // ตรวจสอบสถานะของการตอบกลับ
          if (!response.ok) {
            throw new Error('Failed to fetch search results');
          }
    
          // แปลงข้อมูลที่ได้จาก API เป็น JSON
          const data = await response.json();
          let busstoplatitude = null;
          let busstoplongitude = null;
          // จัดการผลลัพธ์ตามประเภทการค้นหา
          if (type === 'bus') {
            setSearchResults({ buses: data.data, busStops: [] }); // แสดงผลเฉพาะ Bus
            setStoredResults({ buses: data.data, busStops: [] }); // เก็บผลลัพธ์ไว้ในตัวแปร
            
          } else {
            setSearchResults({ buses: [], busStops: data.data }); // แสดงผลเฉพาะ BusStop
            setStoredResults({ buses: [], busStops: data.data }); // เก็บผลลัพธ์ไว้ในตัวแปร
            
            if (data.data && data.data.BusStop_Latitude && data.data.BusStop_Longitude) {
            busstoplatitude = data.data.BusStop_Latitude;
            busstoplongitude= data.data.BusStop_Longitude;
          console.log('Latitude:', data.data.BusStop_Name);
          console.log('Latitude:', busstoplatitude);
          console.log('Longitude:', busstoplongitude);
    
          }
            
          }
          // แสดงผลลัพธ์ที่เก็บไว้หลังการอัพเดต
          console.log('Search Results:', type === 'bus' ? { buses: data.data, busStops: [] } : { buses: [], busStops: data.data });
           
          
        } catch (error) {
          console.error('Error searching:', error);
          alert('An error occurred while searching.');
        }
      };
    return (
        <div>
                <div className="flex flex-row w-full h-full"></div>
                <div className="flex-grow"></div>
                <Map storedResults={storedResults}/>
                <SearchBox onSearch={handleSearch} 
            searchType={searchType} 
            setSearchType={setSearchType} 
            suggestions={storedResults[searchType === 'bus' ? 'buses' : 'busStops']}/>
                
                     
                
            
        </div>
    );
}
