import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Sending a request to the backend to log the user out
      await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });

      // Clear the user session in your frontend (optional)
      // This could be done by removing the token from localStorage/sessionStorage
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('user');

      // Redirect to the login page
      navigate('/login');
    } catch (err) {
      console.error('Logout Error:', err);
      // You can show an error message here if needed
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
    >
      Logout
    </button>
  );
};

export default Logout;
