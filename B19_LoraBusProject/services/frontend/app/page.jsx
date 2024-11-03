'use client'
import React from "react";
import Map from "./component/user/Map";
import SearchBox from "./component/user/Searchbox";
import ThemeProvider from "./component/theme/ThemeProvider";
import { useEffect, useState } from 'react';
import ReportModal from "./component/user/ReportModal";
import OpenReportButton from "./component/user/OpenReportButton";
import Hamburger from "./component/user/HamburgerMenu";

export default function AdminPage({}) {
  const [searchResults, setSearchResults] = useState({
    buses: [],
    busStops: [],
  });

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

    setSearchType(type);

    try {
      let response;
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

      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }

      const data = await response.json();
      if (type === 'bus') {
        setSearchResults({ buses: data.data, busStops: [] });
        setStoredResults({ buses: data.data, busStops: [] });
      } else {
        setSearchResults({ buses: [], busStops: data.data });
        setStoredResults({ buses: [], busStops: data.data });
      }
    } catch (error) {
      console.error('Error searching:', error);
      alert('An error occurred while searching.');
    }
  };

  return (
    <>
      <ThemeProvider>
        <Hamburger />
        <div className="fixed m-5 top-0 left-0 z-50">
          
        </div>
        <div className="dark:bg-gray-900 flex flex-col h-screen">
          <div className="flex-grow flex relative">
            <div className="flex-grow">
              <Map storedResults={storedResults} />
            </div>

            

            <div className="absolute bottom-0 right-5 z-50 w-full sm:w-3/4 md:w-1/3 lg:w-1/4 p-4">
              <SearchBox
                onSearch={handleSearch}
                searchType={searchType}
                setSearchType={setSearchType}
                suggestions={storedResults[searchType === 'bus' ? 'buses' : 'busStops']}
              />
            </div>
          </div>
        </div>
      </ThemeProvider>
    </>
  );
}
