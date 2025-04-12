import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-50">
      <h1 className="text-4xl font-bold mb-8">Welcome to UMIS</h1>
      <div className="flex space-x-4">
        <button
          onClick={() => navigate('/login')}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
        <button
          onClick={() => navigate('/register')}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
