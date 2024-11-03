"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    // ฟังก์ชันสำหรับการลบคุกกี้
    const deleteCookie = (name) => {
      // document.cookie = name + '=; Max-Age=0; path=/; domain=' + window.location.hostname;
      document.cookie = "Admin_ID=; max-age=0; path=/"
    };
    
    // ลบคุกกี้ที่เกี่ยวข้องกับการเข้าสู่ระบบ
    deleteCookie('Admin_ID'); // หรือคุกกี้อื่น ๆ ที่เกี่ยวข้อง

    // เปลี่ยนเส้นทางผู้ใช้กลับไปที่หน้า login หรือหน้าแรก
    router.push('/login'); // หรือ '/' สำหรับหน้าแรก

  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <h1 className="text-2xl font-bold text-black dark:text-white">Logging out...</h1>
    </div>
  );
}
