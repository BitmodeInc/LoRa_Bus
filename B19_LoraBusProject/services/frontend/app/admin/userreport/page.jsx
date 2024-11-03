"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

export default function UserReports() {
  const router = useRouter();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // ตรวจสอบ Admin_ID ในคุกกี้
    const adminId = document.cookie.split('; ').find(row => row.startsWith('Admin_ID='));
    if (!adminId) {
      window.location.href = '/login'
      alert("คุณไม่มีสิทธิ์ในการเข้าใช้หน้านี้");
      return;
    }

    const fetchReports = async () => {
      try {
        const response = await fetch('https://service.lora-bus.com/web_api/userreport', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch reports');
        }

        const data = await response.json();
        setReports(data.data); // บันทึกข้อมูลที่ได้รับ
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [router]);

  if (loading) return <p className="text-center text-gray-600 dark:text-gray-300">Loading reports...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 text-black dark:bg-gray-900 dark:text-white">
      <div className="container mx-auto p-5">
        <div className="flex items-center mb-5">
         <FontAwesomeIcon icon={faTriangleExclamation} className="text-6xl mr-5" />
          <h2 className="text-4xl font-bold">User Reports</h2>
        </div>

        {reports.length === 0 ? (
          <p className="text-center text-gray-500">No reports found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 border rounded">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700">
                  <th className="px-4 py-2 border dark:border-gray-700">Report ID</th>
                  <th className="px-4 py-2 border dark:border-gray-700">Topic</th>
                  <th className="px-4 py-2 border dark:border-gray-700">Description</th>
                  <th className="px-4 py-2 border dark:border-gray-700">Report Time</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(report => (
                  <tr key={report.Report_ID} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                    <td className="px-4 py-2 border dark:border-gray-700">{report.Report_ID}</td>
                    <td className="px-4 py-2 border dark:border-gray-700">{report.Type}</td>
                    <td className="px-4 py-2 border dark:border-gray-700">{report.Detail}</td>
                    <td className="px-4 py-2 border dark:border-gray-700">
                      {new Date(report.Report_Time).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 
