// "use client";
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';

// const LogsPage = () => {
//   const router = useRouter();
//   const [loraLogs, setLoraLogs] = useState([]);
//   const [editLogs, setEditLogs] = useState([]);
//   const [loginLogs, setLoginLogs] = useState([]);
//   const [searchLogs, setSearchLogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [theme, setTheme] = useState('light');
//   const [selectedLogType, setSelectedLogType] = useState('lora');
//   const [currentPage, setCurrentPage] = useState(1);
//   const rowsPerPage = 100;

//   useEffect(() => {
//     const adminId = document.cookie.split('; ').find(row => row.startsWith('Admin_ID='));
//     if (!adminId) {
//       window.location.href = '/login'
//       alert("คุณไม่มีสิทธิ์ในการเข้าใช้หน้านี้");
//       return;
//     }

//     const fetchData = async () => {
//       try {
//         const [loraResponse, editResponse, loginResponse, searchResponse] = await Promise.all([
//           fetch('https://service.lora-bus.com/admin_api/getLoRaLog'),
//           fetch('https://service.lora-bus.com/admin_api/getEditLog'),
//           fetch('https://service.lora-bus.com/admin_api/getLoginLog'),
//           fetch('https://service.lora-bus.com/admin_api/getSearchLog'),
//         ]);

//         if (!loraResponse.ok || !editResponse.ok || !loginResponse.ok || !searchResponse.ok) {
//           throw new Error('Failed to fetch logs');
//         }

//         const [loraData, editData, loginData, searchData] = await Promise.all([
//           loraResponse.json(),
//           editResponse.json(),
//           loginResponse.json(),
//           searchResponse.json(),
//         ]);

//         setLoraLogs(loraData.data);
//         setEditLogs(editData.data);
//         setLoginLogs(loginData.data);
//         setSearchLogs(searchData.data);
//       } catch (error) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [router]);

//   if (loading) return <p className="text-center text-gray-500">Loading logs...</p>;
//   if (error) return <p className="text-center text-red-500">Error: {error}</p>;

//   const indexOfLastRow = currentPage * rowsPerPage;
//   const indexOfFirstRow = indexOfLastRow - rowsPerPage;

//   const currentRows = {
//     lora: loraLogs.slice(indexOfFirstRow, indexOfLastRow),
//     edit: editLogs.slice(indexOfFirstRow, indexOfLastRow),
//     login: loginLogs.slice(indexOfFirstRow, indexOfLastRow),
//     search: searchLogs.slice(indexOfFirstRow, indexOfLastRow),
//   };

//   const totalPages = {
//     lora: Math.ceil(loraLogs.length / rowsPerPage),
//     edit: Math.ceil(editLogs.length / rowsPerPage),
//     login: Math.ceil(loginLogs.length / rowsPerPage),
//     search: Math.ceil(searchLogs.length / rowsPerPage),
//   };

//   return (
//     <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 p-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
//       <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
//         <h2 className="text-2xl font-semibold mb-4 dark:text-white">Log Information</h2>
        
//         <div className="mb-6">
//           <label htmlFor="logType" className="mr-2 dark:text-white">Select Log Type:</label>
//           <select 
//             id="logType" 
//             value={selectedLogType} 
//             onChange={(e) => {
//               setSelectedLogType(e.target.value);
//               setCurrentPage(1); 
//             }}
//             className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
//           >
//             <option value="lora">LoRaLog</option>
//             <option value="edit">EditLog</option>
//             <option value="login">LoginLog</option>
//             <option value="search">SearchLog</option>
//           </select>
//         </div>
  
//         {/* LoRaLog Section */}
//         {selectedLogType === 'lora' && (
//           <section>
//             <h3 className="text-xl font-semibold mb-2 dark:text-white">LoRaLog Data</h3>
//             {loraLogs.length === 0 ? (
//               <p className="text-gray-500 dark:text-gray-400">No LoRa logs found.</p>
//             ) : (
//               <>
//                 <table className="table-auto w-full mb-6 border-collapse text-left dark:text-white">
//                   <thead>
//                     <tr className="bg-gray-200 dark:bg-gray-700">
//                       <th className="border px-4 py-2">Log ID</th>
//                       <th className="border px-4 py-2">Dip Switch</th>
//                       <th className="border px-4 py-2">Battery</th>
//                       <th className="border px-4 py-2">Temperature</th>
//                       <th className="border px-4 py-2">Latitude</th>
//                       <th className="border px-4 py-2">Longitude</th>
//                       <th className="border px-4 py-2">SNR</th>
//                       <th className="border px-4 py-2">RSSI</th>
//                       <th className="border px-4 py-2">Update Time</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {currentRows.lora.map(log => (
//                       <tr key={log.Log_ID} className="hover:bg-gray-100 dark:hover:bg-gray-600">
//                         <td className="border px-4 py-2">{log.Log_ID}</td>
//                         <td className="border px-4 py-2">{log.Dip_Switch_Value}</td>
//                         <td className="border px-4 py-2">{log.LoRa_Battery}</td>
//                         <td className="border px-4 py-2">{log.LoRa_Temp}</td>
//                         <td className="border px-4 py-2">{log.LoRa_Latitude}</td>
//                         <td className="border px-4 py-2">{log.LoRa_Longitude}</td>
//                         <td className="border px-4 py-2">{log.LoRa_SNR}</td>
//                         <td className="border px-4 py-2">{log.LoRa_RSSI}</td>
//                         <td className="border px-4 py-2">{new Date(log.Update_Time).toLocaleString()}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//                 <Pagination 
//                   currentPage={currentPage} 
//                   setCurrentPage={setCurrentPage} 
//                   totalPages={totalPages.lora} 
//                 />
//               </>
//             )}
//           </section>
//         )}
  
//         {/* EditLog Section */}
//         {selectedLogType === 'edit' && (
//           <section>
//             <h3 className="text-xl font-semibold mb-2 dark:text-white">EditLog Data</h3>
//             {editLogs.length === 0 ? (
//               <p className="text-gray-500 dark:text-white">No Edit logs found.</p>
//             ) : (
//               <>
//                 <table className="table-auto w-full mb-6 border-collapse text-left dark:text-white">
//                   <thead>
//                     <tr className="bg-gray-200 dark:bg-gray-700">
//                       <th className="border px-4 py-2">Log ID</th>
//                       <th className="border px-4 py-2">Admin ID</th>
//                       <th className="border px-4 py-2">ID</th>
//                       <th className="border px-4 py-2">Type</th>
//                       <th className="border px-4 py-2">Edit Detail</th>
//                       <th className="border px-4 py-2">Edit Time</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {currentRows.edit.map(log => (
//                       <tr key={log.Log_ID} className="hover:bg-gray-100 dark:hover:bg-gray-600">
//                         <td className="border px-4 py-2">{log.Log_ID}</td>
//                         <td className="border px-4 py-2">{log.Admin_ID}</td>
//                         <td className="border px-4 py-2">{log.ID}</td>
//                         <td className="border px-4 py-2">{log.Type}</td>
//                         <td className="border px-4 py-2">{log.Edit_Detail}</td>
//                         <td className="border px-4 py-2">{new Date(log.Edit_Time).toLocaleString()}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//                 <Pagination 
//                   currentPage={currentPage} 
//                   setCurrentPage={setCurrentPage} 
//                   totalPages={totalPages.edit} 
//                 />
//               </>
//             )}
//           </section>
//         )}
  
//         {/* LoginLog Section */}
//         {selectedLogType === 'login' && (
//           <section>
//             <h3 className="text-xl font-semibold mb-2 dark:text-white">LoginLog Data</h3>
//             {loginLogs.length === 0 ? (
//               <p className="text-gray-500 dark:text-white">No Login logs found.</p>
//             ) : (
//               <>
//                 <table className="table-auto w-full mb-6 border-collapse text-left dark:text-white">
//                   <thead>
//                     <tr className="bg-gray-200 dark:bg-gray-700">
//                       <th className="border px-4 py-2">Log ID</th>
//                       <th className="border px-4 py-2">Username</th>
//                       <th className="border px-4 py-2">Status</th>
//                       <th className="border px-4 py-2">IP Address</th>
//                       <th className="border px-4 py-2">Login Time</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {currentRows.login.map(log => (
//                       <tr key={log.Log_ID} className="hover:bg-gray-100 dark:hover:bg-gray-600">
//                         <td className="border px-4 py-2">{log.Log_ID}</td>
//                         <td className="border px-4 py-2">{log.Username}</td>
//                         <td className="border px-4 py-2">{log.Status}</td>
//                         <td className="border px-4 py-2">{log.IP_Address}</td>
//                         <td className="border px-4 py-2">{new Date(log.Login_Time).toLocaleString()}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//                 <Pagination 
//                   currentPage={currentPage} 
//                   setCurrentPage={setCurrentPage} 
//                   totalPages={totalPages.login} 
//                 />
//               </>
//             )}
//           </section>
//         )}
  
//         {/* SearchLog Section */}
//         {selectedLogType === 'search' && (
//           <section>
//             <h3 className="text-xl font-semibold mb-2 dark:text-white">SearchLog Data</h3>
//             {searchLogs.length === 0 ? (
//               <p className="text-gray-500 dark:text-white">No Search logs found.</p>
//             ) : (
//               <>
//                 <table className="table-auto w-full mb-6 border-collapse text-left dark:text-white">
//                   <thead>
//                     <tr className="bg-gray-200 dark:bg-gray-700">
//                       <th className="border px-4 py-2">Log ID</th>
//                       <th className="border px-4 py-2">User IP Address</th>
//                       <th className="border px-4 py-2">Type</th>
//                       <th className="border px-4 py-2">Search Term</th>
//                       <th className="border px-4 py-2">Search Time</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {currentRows.search.map(log => (
//                       <tr key={log.Log_ID} className="hover:bg-gray-100 dark:hover:bg-gray-600">
//                         <td className="border px-4 py-2">{log.Log_ID}</td>
//                         <td className="border px-4 py-2">{log.User_IP_Address}</td>
//                         <td className="border px-4 py-2">{log.Type}</td>
//                         <td className="border px-4 py-2">{log.Search_Term}</td>
//                         <td className="border px-4 py-2">{new Date(log.Search_Time).toLocaleString()}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//                 <Pagination 
//                   currentPage={currentPage} 
//                   setCurrentPage={setCurrentPage} 
//                   totalPages={totalPages.search} 
//                 />
//               </>
//             )}
//           </section>
//         )}
//       </div>
//     </div>
//   );
// };

// const Pagination = ({ currentPage, setCurrentPage, totalPages }) => {
//   const handlePageChange = (newPage) => {
//     setCurrentPage(newPage);
//   };

//   return (
//     <div className="flex justify-center">
//       <button 
//         onClick={() => handlePageChange(1)} 
//         disabled={currentPage === 1} 
//         className={`mr-2 px-4 py-2 border rounded  bg-blue-500 ${currentPage === 1 ? 'opacity-50' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
//       >
//         First
//       </button>
//       <button 
//         onClick={() => handlePageChange(currentPage - 1)} 
//         disabled={currentPage === 1} 
//         className={`mr-2 px-4 py-2 border rounded  bg-blue-500 ${currentPage === 1 ? 'opacity-50' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
//       >
//         Previous
//       </button>
//       <span className="mx-2 dark:text-white">Page {currentPage} of {totalPages}</span>
//       <button 
//         onClick={() => handlePageChange(currentPage + 1)} 
//         disabled={currentPage === totalPages} 
//         className={`ml-2 px-4 py-2 border rounded bg-blue-500 ${currentPage === totalPages ? 'opacity-50' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
//       >
//         Next
//       </button>
//       <button 
//         onClick={() => handlePageChange(totalPages)} 
//         disabled={currentPage === totalPages} 
//         className={`ml-2 px-4 py-2 border rounded bg-blue-500 ${currentPage === totalPages ? 'opacity-50' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
//       >
//         Last
//       </button>
//     </div>
//   );
// };

// export default LogsPage;
