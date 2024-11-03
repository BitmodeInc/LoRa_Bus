'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [resetPassword, setResetPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // เพิ่ม state สำหรับเก็บข้อความแจ้งเตือน
  const router = useRouter();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('https://service.lora-bus.com/admin_api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        document.cookie = `Admin_ID=${data.adminid}; max-age=3600; path=/`;
        window.location.href = "/admin";
      } else {
        const errorData = await response.json();
        setErrorMessage('Username or Password is Incorrect'); // ตั้งค่าข้อความแจ้งเตือนเมื่อ login ไม่สำเร็จ
      }
    } catch (error) {
      console.error('Error during fetch:', error);
      setErrorMessage('เกิดข้อผิดพลาด กรุณาลองอีกครั้ง'); // ตั้งค่าข้อความเมื่อเกิดข้อผิดพลาดอื่น ๆ
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('https://service.lora-bus.com/admin_api/requestreset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        console.log('Password reset email sent');
        setResetPassword(false);
        router.push('/');
      } else {
        console.error('Password reset request failed');
      }
    } catch (error) {
      console.error('Error during fetch:', error);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full space-y-6" onSubmit={handleLogin}>
          <img src="/images/logoHam.png" alt="Logo" className=" w-65 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-center mb-6 text-black">Login</h1>

          {/* ช่องกรอก username */}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300 text-black"
          />

          {/* ช่องกรอก password */}
          <div className="relative">
            <input
              type={passwordVisible ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300 text-black"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
              onClick={togglePasswordVisibility}
            >
              👁️
            </button>
          </div>

          {/* ข้อความแจ้งเตือนเมื่อ login ผิด */}
          {errorMessage && (
            <div className="text-red-500 text-sm text-center">{errorMessage}</div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
          >
            Login
          </button>

          <div className="text-right">
            <p
              className="text-sm text-red-500 cursor-pointer hover:underline"
              onClick={() => setResetPassword(true)}
            >
              Forgot password?
            </p>
          </div>
        </form>
      </div>

      {/* Modal สำหรับ reset password */}
      {resetPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full space-y-4">
            <h2 className="text-xl font-semibold">Reset Password</h2>
            <form onSubmit={handleResetPassword}>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Enter your email:
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300 text-black mb-4"
              />
              <button
                type="submit"
                className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
              >
                Send Reset Link
              </button>
              <button
                type="button"
                onClick={() => setResetPassword(false)}
                className="w-full py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors mt-3"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
