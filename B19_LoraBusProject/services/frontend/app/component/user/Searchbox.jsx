'use client';

import React, { useState } from 'react';

const SearchBox = ({ searchType, setSearchType, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const handleInputChange = async (e) => {
    const value = e.target.value.trim();
    setSearchTerm(value);
    if (value) await fetchSuggestions(value);
    else setFilteredSuggestions([]);
  };

  const fetchSuggestions = async (searchValue) => {
    try {
      const queryParam = searchType === 'bus' ? 'bus_name' : 'busstop_name';
      const response = await fetch(`https://service.lora-bus.com/web_api/searchbox/${searchType}?${queryParam}=${encodeURIComponent(searchValue)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const data = await response.json();
      setFilteredSuggestions(Array.isArray(data.data) ? data.data : [data.data]);
    } catch (error) {
      setFilteredSuggestions([]);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setSearchTerm(searchType === 'bus' ? suggestion.Bus_Name : suggestion.BusStop_Name);
    setFilteredSuggestions([]);
  };

  const handleSearch = () => {
    if (onSearch) onSearch(searchTerm, searchType);
  };

  return (
   
    <div className="max-w-lg  mx-auto  p-5 bg-gray-50 dark:bg-gray-900 rounded-md shadow-md">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={`Search ${searchType === 'bus' ? 'Bus ' : 'Bus Stop'}`}
          className="w-full p-2 border rounded-md text-black dark:text-white bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {filteredSuggestions.length > 0 && (
          <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg max-h-48 overflow-y-auto">
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSelectSuggestion(suggestion)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                {searchType === 'bus' ? suggestion.Bus_Name : suggestion.BusStop_Name}
              </li>
            ))}
          </ul>
        )}
      </div>
      

      <div className="flex items-center mt-2 space-x-2">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="p-2 rounded-md border border-gray-300 dark:border-gray-700 text-black dark:text-white bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="bus">Bus</option>
          <option value="busstop">Bus Stop</option>
        </select>

        <button
          onClick={handleSearch}
          aria-label="Search"
          className="p-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <img src="/images/searchicon.png" alt="Search" className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default SearchBox;
