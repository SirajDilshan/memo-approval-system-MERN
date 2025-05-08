// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // Changed from '../context/AuthContext'
import Navbar from "./navigation/Navbar";
import Dashboard from "./navigation/Dashboard";
import Login from "./login_register/Login";
import LandingPage from "./pages/LandingPages"; // Fixed typo from 'LandingPages'
import Register from "./login_register/Register";
import DashboardRouter from "./navigation/DashboardRouter";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard" element={<DashboardRouter />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
