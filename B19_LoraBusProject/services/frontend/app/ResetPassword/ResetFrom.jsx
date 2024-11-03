"use client";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const ResetFrom = () => {
  const [newPassword, setNewPassword] = useState('');
  const [token, setToken] = useState(null); // For storing token
  const router = useRouter();
  const searchParams = useSearchParams(); // To get token from URL

  const resetToken = searchParams.get('token');

  // Extract token from query parameter
  useEffect(() => {
    if (resetToken) {
      setToken(resetToken);
    } else {
      // Redirect or show an error if no token is provided
      console.error('No token found in the URL');
      // You can also navigate the user away
      // router.push("/login");
    }
  }, [resetToken]);

  const handleResetPassword = async (event) => {
    event.preventDefault();

    if (!token) {
      console.error('No reset token available');
      return;
    }

    try {
      const response = await fetch('https://service.lora-bus.com/admin_api/resetPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      if (response.ok) {
        console.log('Password reset successful');
        router.push('/'); // Redirect to login after success
      } else {
        console.error('Password reset failed');
      }
    } catch (error) {
      console.error('Error during fetch:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
        <h1 className="text-2xl font-semibold text-center mb-6 text-black">Set New Password</h1>
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label htmlFor="new-password" className="block text-gray-700 font-medium mb-2">
              Enter your new password:
            </label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 text-black" // เพิ่ม text-black ตรงนี้
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-indigo-500 text-white py-2 rounded-lg font-semibold hover:bg-indigo-600 transition duration-200"
            >
              Set New Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetFrom;
