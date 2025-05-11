// src/components/Navbar.js
import { Link } from "react-router-dom";
import {useEffect} from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { AppBar, Toolbar, IconButton, Badge, Button, Typography, Box } from "@mui/material";
import { FaBell, FaUniversity, FaSignOutAlt, FaChartLine, FaSignInAlt, FaUserPlus } from "react-icons/fa";

const Navbar = () => {
  const {  notificationCount, showNotifications, setShowNotifications, currentUser, setNotificationCount ,setNotifications} = useAuth();
  const auth = useAuth();

  const handleLogout = () => {
    auth.logout();
  };
  useEffect(() => {
    let intervalId;

    const fetchNotifications = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/notifications/role/${currentUser}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setNotifications(res.data);
  
        setNotificationCount(res.data.length);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    if (currentUser) {
      fetchNotifications(); // initial fetch
      intervalId = setInterval(fetchNotifications, 4000); // fetch every 4 sec
    }

    return () => clearInterval(intervalId); // clean up
  }, [currentUser, setNotificationCount,setNotifications]);

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "primary.main" }}>
      <Toolbar>
        <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <FaUniversity size={30} />
          <Typography variant="h6" sx={{ ml: 1, fontSize: "1.5rem", fontWeight: "bold", color: "white" }}>
            UMIS
          </Typography>
        </Link>
        
        <Box sx={{ flexGrow: 1 }} />

        {auth.currentUser ? (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Link to="/dashboard" style={{ textDecoration: "none" }}>
              <Button sx={{ color: "white", "&:hover": { color: "#90caf9" } }} startIcon={<FaChartLine />}>
                Dashboard
              </Button>
            </Link>


            <Button onClick={handleLogout} sx={{ color: "white", "&:hover": { color: "#f44336" } }} startIcon={<FaSignOutAlt />}>
              Logout
            </Button>

            <IconButton onClick={() => setShowNotifications(!showNotifications)} color="inherit">
              <Badge
                badgeContent={notificationCount}
                color="error"
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <FaBell size={20} />
              </Badge>
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Link to="/login" style={{ textDecoration: "none" }}>
              <Button sx={{ color: "white", "&:hover": { color: "#90caf9" } }} startIcon={<FaSignInAlt />}>
                Login
              </Button>
            </Link>

            <Link to="/register" style={{ textDecoration: "none" }}>
              <Button variant="contained" color="secondary" startIcon={<FaUserPlus />}>
                Register
              </Button>
            </Link>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
