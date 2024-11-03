"use client";
import { useState } from 'react';

const ReportModal = ({ onClose }) => {
  const [reportType, setReportType] = useState('');
  const [detail, setDetail] = useState('');
  const [submitStatus, setSubmitStatus] = useState(''); // เพิ่มสถานะการส่งรายงาน

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!reportType) {
      alert('Please select a type of report.');
      return;
    }

    if (!detail) {
      alert('Please fill in the details.');
      return;
    }

    try {
      const response = await fetch('https://service.lora-bus.com/web_api/userreport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: reportType, detail: detail }),
      });
      if (response.ok) {
        setSubmitStatus('Report submitted successfully'); // ตั้งค่าข้อความเมื่อส่งสำเร็จ
        setTimeout(() => {
          onClose(); // ปิด modal หลังจากแสดงข้อความเสร็จ
        }, 2000); // ปิด modal หลัง 2 วินาที
      } else {
        setSubmitStatus('Failed to submit report');
      }
    } catch (error) {
      setSubmitStatus('Error submitting report');
    }
  };

  const handleClose = () => {
    setReportType('');
    setDetail('');
    setSubmitStatus(''); // รีเซ็ตข้อความสถานะ
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 dark:text-black">Report an Issue</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="report-type" className="block text-sm font-medium text-gray-700 mb-1">Type of Report:</label>
          <select
            id="report-type"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="block w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-black"
          >
            <option value="">Select a type</option>
            <option value="ปัญหาเกี่ยวกับคนขับ">ปัญหาเกี่ยวกับคนขับ</option>
            <option value="ปัญหาเกี่ยวกับรถรับ-ส่ง">ปัญหาเกี่ยวกับรถรับ-ส่ง</option>
            <option value="ปัญหาเกี่ยวกับเว็บแอปพลิเคชัน">ปัญหาเกี่ยวกับเว็บแอปพลิเคชัน</option>
            <option value="อื่นๆ">อื่นๆ</option>
          </select>

          <label htmlFor="detail" className="block text-sm font-medium text-gray-700 mb-1">Detail:</label>
          <textarea
            id="detail"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            required
            className="block w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-black"
          ></textarea>

          <div className="flex justify-end">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-150">Submit Report</button>
            <button type="button" onClick={handleClose} className="ml-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-150">Cancel</button>
          </div>
        </form>

        {/* แสดงสถานะการส่งรายงาน */}
        {submitStatus && (
          <p className="text-green-500 mt-4 text-center">{submitStatus}</p>
        )}
      </div>
    </div>
  );
};

export default ReportModal;
