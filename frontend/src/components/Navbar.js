// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUniversity, FaUserCircle, FaSignOutAlt, FaChartLine, FaCog, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

const Navbar = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to={auth.currentUser ? "/dashboard" : "/"}
          className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors duration-300"
        >
          <FaUniversity className="text-3xl" />
          <span className="text-2xl font-bold hidden sm:inline-block">UMIS</span>
        </Link>

        <div className="flex items-center space-x-4 md:space-x-6">
          {auth.currentUser ? (
            <>
              <Link to="/dashboard" className="flex items-center text-white hover:text-blue-200 transition-colors duration-300">
                <FaChartLine className="mr-1" />
                <span className="hidden md:inline">Dashboard</span>
              </Link>
              <Link to="/profile" className="flex items-center text-white hover:text-blue-200 transition-colors duration-300">
                <FaUserCircle className="mr-1" />
                <span className="hidden md:inline">Profile</span>
              </Link>
              <Link to="/settings" className="flex items-center text-white hover:text-blue-200 transition-colors duration-300">
                <FaCog className="mr-1" />
                <span className="hidden md:inline">Settings</span>
              </Link>
              <button onClick={handleLogout} className="flex items-center text-white hover:text-red-300 transition-colors duration-300">
                <FaSignOutAlt className="mr-1" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="flex items-center px-3 py-1 text-white hover:text-blue-200 transition-colors duration-300">
                <FaSignInAlt className="mr-1" />
                <span className="hidden md:inline">Login</span>
              </Link>
              <Link to="/register" className="flex items-center px-3 py-1 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors duration-300">
                <FaUserPlus className="mr-1" />
                <span className="hidden md:inline">Register</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;