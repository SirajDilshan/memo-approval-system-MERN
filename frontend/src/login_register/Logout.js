import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Sending a request to the backend to log the user out
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });

      // Clear the user session in your frontend (optional)
      sessionStorage.removeItem("token"); // Remove token
      sessionStorage.removeItem("role");  // Optional: remove user role or any other session data

      // Redirect to the login page
      navigate("/login");
    } catch (err) {
      console.error("Logout Error:", err);
      // You can show an error message here if needed
    }
  };

  return (
    <Button
      onClick={handleLogout}
      variant="contained"
      color="error"
      sx={{ padding: "8px 16px", borderRadius: "8px" }}
    >
      Logout
    </Button>
  );
};

export default Logout;
