// src/components/Navbar.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaBell,
  FaUniversity,
  FaUserCircle,
  FaSignOutAlt,
  FaChartLine,
  FaCog,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";
import Notifications from "../components/notifications/Notifications";

const Navbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { currentUser, notificationCount } = useAuth();

  const auth = useAuth();

  const handleLogout = () => {
    auth.logout();
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 shadow-lg relative">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors duration-300"
        >
          <FaUniversity className="text-3xl" />
          <span className="text-2xl font-bold hidden sm:inline-block">
            UMIS
          </span>
        </Link>

        <div className="flex items-center space-x-4 md:space-x-6">
          {auth.currentUser ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center text-white hover:text-blue-200 transition-colors duration-300"
              >
                <FaChartLine className="mr-1" />
                <span className="hidden md:inline">Dashboard</span>
              </Link>
              <Link
                to="/profile"
                className="flex items-center text-white hover:text-blue-200 transition-colors duration-300"
              >
                <FaUserCircle className="mr-1" />
                <span className="hidden md:inline">Profile</span>
              </Link>
              <Link
                to="/settings"
                className="flex items-center text-white hover:text-blue-200 transition-colors duration-300"
              >
                <FaCog className="mr-1" />
                <span className="hidden md:inline">Settings</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center text-white hover:text-red-300 transition-colors duration-300"
              >
                <FaSignOutAlt className="mr-1" />
                <span className="hidden md:inline">Logout</span>
              </button>

              {currentUser && (
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative text-white hover:text-red-300 transition-colors duration-300"
                >
                  <FaBell className="text-lg" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </button>
              )}
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center px-3 py-1 text-white hover:text-blue-200 transition-colors duration-300"
              >
                <FaSignInAlt className="mr-1" />
                <span className="hidden md:inline">Login</span>
              </Link>
              <Link
                to="/register"
                className="flex items-center px-3 py-1 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors duration-300"
              >
                <FaUserPlus className="mr-1" />
                <span className="hidden md:inline">Register</span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Show Notifications component in top-right corner */}
      {showNotifications && (
        <div className="absolute top-20 right-4 z-50">
          <Notifications />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
